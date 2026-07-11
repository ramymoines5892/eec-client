import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/business-partners/")({
  component: BusinessPartnersPage,
});

type Partner = {
  id: string;
  code: string;
  legal_name: string;
  legal_name_ar: string | null;
  trade_name: string | null;
  tax_number: string | null;
  registration_number: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  country_code: string | null;
  city: string | null;
  address: string | null;
};

function BusinessPartnersPage() {
  const t = useT();

  const { data: rolesByPartner = {} } = useQuery({
    queryKey: ["business_partner_roles_map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("business_partner_roles").select("partner_id, role, is_active");
      if (error) throw error;
      const map: Record<string, string[]> = {};
      for (const r of data ?? []) {
        if (!r.is_active) continue;
        (map[r.partner_id] ||= []).push(r.role);
      }
      return map;
    },
  });

  return (
    <SimpleCrud<Partner>
      tableName="business_partners"
      title={t("admin.nav.businessPartners")}
      subtitle={t("admin.desc.businessPartners")}
      orderBy="code"
      searchFields={["code", "legal_name", "trade_name", "tax_number"]}
      emptyValues={{
        code: "", legal_name: "", legal_name_ar: null, trade_name: null,
        tax_number: null, registration_number: null, email: null, phone: null,
        website: null, country_code: null, city: null, address: null,
      }}
      validate={(v) => {
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.legal_name?.trim()) return t("admin.bp.err.legal");
        return null;
      }}
      columns={[
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs" },
        { key: "legal_name", header: t("admin.bp.legalName") },
        {
          key: "id",
          header: t("admin.bp.roles"),
          render: (r) => (
            <div className="flex flex-wrap gap-1">
              {(rolesByPartner[r.id] ?? []).map((role) => (
                <Badge key={role} variant="secondary" className="text-[10px]">{t(`admin.bp.role.${role}`)}</Badge>
              ))}
              {(rolesByPartner[r.id] ?? []).length === 0 && <span className="text-xs text-muted-foreground">—</span>}
            </div>
          ),
        },
        { key: "tax_number", header: t("admin.bp.taxNo") },
        {
          key: "id",
          header: "",
          render: (r) => (
            <Link to="/admin/business-partners/$partnerId" params={{ partnerId: r.id }}>
              <Button variant="ghost" size="icon" title={t("admin.bp.manageRoles")}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ),
        },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.ref.col.code")} *`}>
            <Input value={values.code ?? ""} onChange={(e) => setValue("code", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`${t("admin.bp.legalName")} *`}>
              <Input value={values.legal_name ?? ""} onChange={(e) => setValue("legal_name", e.target.value)} />
            </FormField>
            <FormField label={t("admin.bp.legalNameAr")}>
              <Input dir="rtl" value={values.legal_name_ar ?? ""} onChange={(e) => setValue("legal_name_ar", e.target.value || null)} />
            </FormField>
          </div>
          <FormField label={t("admin.bp.tradeName")}>
            <Input value={values.trade_name ?? ""} onChange={(e) => setValue("trade_name", e.target.value || null)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("admin.bp.taxNo")}>
              <Input value={values.tax_number ?? ""} onChange={(e) => setValue("tax_number", e.target.value || null)} />
            </FormField>
            <FormField label={t("admin.bp.regNo")}>
              <Input value={values.registration_number ?? ""} onChange={(e) => setValue("registration_number", e.target.value || null)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("common.email")}>
              <Input type="email" value={values.email ?? ""} onChange={(e) => setValue("email", e.target.value || null)} />
            </FormField>
            <FormField label={t("common.telephone")}>
              <Input value={values.phone ?? ""} onChange={(e) => setValue("phone", e.target.value || null)} />
            </FormField>
          </div>
          <FormField label={t("admin.org.website")}>
            <Input value={values.website ?? ""} onChange={(e) => setValue("website", e.target.value || null)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("common.country")}>
              <Input value={values.country_code ?? ""} onChange={(e) => setValue("country_code", e.target.value || null)} />
            </FormField>
            <FormField label={t("common.city")}>
              <Input value={values.city ?? ""} onChange={(e) => setValue("city", e.target.value || null)} />
            </FormField>
          </div>
          <FormField label={t("common.address")}>
            <Textarea rows={2} value={values.address ?? ""} onChange={(e) => setValue("address", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
