
-- Extend app_role enum with ERP roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'procurement';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'warehouse';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Numbering sequences
CREATE TABLE public.numbering_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  prefix TEXT NOT NULL DEFAULT '',
  suffix TEXT NOT NULL DEFAULT '',
  padding INT NOT NULL DEFAULT 5,
  next_value BIGINT NOT NULL DEFAULT 1,
  reset_policy TEXT NOT NULL DEFAULT 'never',
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, module, doc_type)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.numbering_sequences TO authenticated;
GRANT ALL ON public.numbering_sequences TO service_role;
ALTER TABLE public.numbering_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view numbering" ON public.numbering_sequences FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert numbering" ON public.numbering_sequences FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update numbering" ON public.numbering_sequences FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete numbering" ON public.numbering_sequences FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_numbering_updated BEFORE UPDATE ON public.numbering_sequences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workflow templates
CREATE TABLE public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_templates TO authenticated;
GRANT ALL ON public.workflow_templates TO service_role;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view wf tmpl" ON public.workflow_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert wf tmpl" ON public.workflow_templates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update wf tmpl" ON public.workflow_templates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete wf tmpl" ON public.workflow_templates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_wf_tmpl_updated BEFORE UPDATE ON public.workflow_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workflow steps
CREATE TABLE public.workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.workflow_templates(id) ON DELETE CASCADE,
  step_no INT NOT NULL,
  name TEXT NOT NULL,
  role_required TEXT,
  min_approvers INT NOT NULL DEFAULT 1,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (template_id, step_no)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workflow_steps TO authenticated;
GRANT ALL ON public.workflow_steps TO service_role;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view wf steps" ON public.workflow_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert wf steps" ON public.workflow_steps FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update wf steps" ON public.workflow_steps FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete wf steps" ON public.workflow_steps FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_wf_steps_updated BEFORE UPDATE ON public.workflow_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
