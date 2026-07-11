
-- BUSINESS PARTNERS
CREATE TABLE public.business_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  legal_name text NOT NULL,
  legal_name_ar text,
  trade_name text,
  tax_number text,
  registration_number text,
  email text,
  phone text,
  website text,
  country_code text,
  city text,
  address text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_partners TO authenticated;
GRANT ALL ON public.business_partners TO service_role;
ALTER TABLE public.business_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View partners" ON public.business_partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert partners" ON public.business_partners FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update partners" ON public.business_partners FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete partners" ON public.business_partners FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_business_partners_updated_at BEFORE UPDATE ON public.business_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BUSINESS PARTNER ROLES
CREATE TABLE public.business_partner_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.business_partners(id) ON DELETE CASCADE,
  role text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_partner_roles TO authenticated;
GRANT ALL ON public.business_partner_roles TO service_role;
ALTER TABLE public.business_partner_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View partner roles" ON public.business_partner_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert partner roles" ON public.business_partner_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update partner roles" ON public.business_partner_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete partner roles" ON public.business_partner_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_bpr_partner ON public.business_partner_roles(partner_id);
CREATE INDEX idx_bpr_role ON public.business_partner_roles(role);
