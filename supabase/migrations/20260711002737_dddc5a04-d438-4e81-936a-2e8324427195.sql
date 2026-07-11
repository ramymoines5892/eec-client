
-- =========================================
-- REFERENCE DATA FRAMEWORK
-- =========================================

CREATE TABLE public.reference_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description text,
  is_hierarchical boolean NOT NULL DEFAULT false,
  is_system boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reference_sources TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reference_sources TO authenticated;
GRANT ALL ON public.reference_sources TO service_role;
ALTER TABLE public.reference_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view reference_sources"
  ON public.reference_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert reference_sources"
  ON public.reference_sources FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reference_sources"
  ON public.reference_sources FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reference_sources"
  ON public.reference_sources FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND is_system = false);

CREATE TRIGGER trg_reference_sources_updated_at
  BEFORE UPDATE ON public.reference_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.reference_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.reference_sources(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.reference_values(id) ON DELETE CASCADE,
  code text NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, code)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reference_values TO authenticated;
GRANT ALL ON public.reference_values TO service_role;
ALTER TABLE public.reference_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view reference_values"
  ON public.reference_values FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert reference_values"
  ON public.reference_values FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reference_values"
  ON public.reference_values FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reference_values"
  ON public.reference_values FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_reference_values_source ON public.reference_values(source_id);
CREATE INDEX idx_reference_values_parent ON public.reference_values(parent_id);

CREATE TRIGGER trg_reference_values_updated_at
  BEFORE UPDATE ON public.reference_values
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =========================================
-- ENTITY LIFECYCLE (generic panels)
-- =========================================

CREATE TABLE public.entity_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  from_status text,
  to_status text,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.entity_history TO authenticated;
GRANT ALL ON public.entity_history TO service_role;
ALTER TABLE public.entity_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view entity_history"
  ON public.entity_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert entity_history"
  ON public.entity_history FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid());

CREATE INDEX idx_entity_history_entity ON public.entity_history(entity_type, entity_id);


CREATE TABLE public.entity_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  revision_no int NOT NULL,
  snapshot jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, revision_no)
);

GRANT SELECT, INSERT ON public.entity_revisions TO authenticated;
GRANT ALL ON public.entity_revisions TO service_role;
ALTER TABLE public.entity_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view entity_revisions"
  ON public.entity_revisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert entity_revisions"
  ON public.entity_revisions FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE INDEX idx_entity_revisions_entity ON public.entity_revisions(entity_type, entity_id);


CREATE TABLE public.entity_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.entity_attachments TO authenticated;
GRANT ALL ON public.entity_attachments TO service_role;
ALTER TABLE public.entity_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view entity_attachments"
  ON public.entity_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert entity_attachments"
  ON public.entity_attachments FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "Owners or admins can delete entity_attachments"
  ON public.entity_attachments FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_entity_attachments_entity ON public.entity_attachments(entity_type, entity_id);


CREATE TABLE public.entity_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  step_no int NOT NULL DEFAULT 1,
  approver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decision text NOT NULL DEFAULT 'pending',
  note text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.entity_approvals TO authenticated;
GRANT ALL ON public.entity_approvals TO service_role;
ALTER TABLE public.entity_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view entity_approvals"
  ON public.entity_approvals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert entity_approvals"
  ON public.entity_approvals FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Approver or admin can update entity_approvals"
  ON public.entity_approvals FOR UPDATE TO authenticated
  USING (approver_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (approver_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_entity_approvals_entity ON public.entity_approvals(entity_type, entity_id);


CREATE TABLE public.entity_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.entity_comments TO authenticated;
GRANT ALL ON public.entity_comments TO service_role;
ALTER TABLE public.entity_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view entity_comments"
  ON public.entity_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert own comments"
  ON public.entity_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update own comments"
  ON public.entity_comments FOR UPDATE TO authenticated
  USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors or admins can delete comments"
  ON public.entity_comments FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_entity_comments_entity ON public.entity_comments(entity_type, entity_id);

CREATE TRIGGER trg_entity_comments_updated_at
  BEFORE UPDATE ON public.entity_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =========================================
-- SEED SYSTEM REFERENCE SOURCES
-- =========================================

INSERT INTO public.reference_sources (code, name_en, name_ar, description, is_hierarchical, is_system)
VALUES
  ('CURRENCY', 'Currencies', 'العملات', 'ISO 4217 currency codes', false, true),
  ('COUNTRY', 'Countries', 'الدول', 'ISO 3166 country codes', false, true),
  ('UOM', 'Units of Measure', 'وحدات القياس', 'Standard units of measure', true, true),
  ('PAYMENT_TERM', 'Payment Terms', 'شروط الدفع', 'Standard payment terms', false, true),
  ('LANGUAGE', 'Languages', 'اللغات', 'Supported languages', false, true)
ON CONFLICT (code) DO NOTHING;
