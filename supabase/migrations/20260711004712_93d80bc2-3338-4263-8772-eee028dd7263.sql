
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (company_id, key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view sys" ON public.system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert sys" ON public.system_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update sys" ON public.system_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete sys" ON public.system_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_sys_updated BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_native TEXT NOT NULL,
  is_rtl BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.languages TO authenticated;
GRANT ALL ON public.languages TO service_role;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view langs" ON public.languages FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert langs" ON public.languages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update langs" ON public.languages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete langs" ON public.languages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_langs_updated BEFORE UPDATE ON public.languages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.languages (code, name_en, name_native, is_rtl, sort_order) VALUES
  ('en', 'English', 'English', false, 10),
  ('ar', 'Arabic', 'العربية', true, 20)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE public.attribute_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attribute_templates TO authenticated;
GRANT ALL ON public.attribute_templates TO service_role;
ALTER TABLE public.attribute_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth view tmpl" ON public.attribute_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert tmpl" ON public.attribute_templates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update tmpl" ON public.attribute_templates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete tmpl" ON public.attribute_templates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_tmpl_updated BEFORE UPDATE ON public.attribute_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
