import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/system/")({
  component: SystemPage,
});

type Setting = {
  id: string;
  company_id: string | null;
  key: string;
  value: string | null;
  description: string | null;
};

function SystemPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string | null) => (id ? companies.find((c) => c.id === id)?.name ?? "—" : t("admin.sys.global"));

  return (
    <SimpleCrud<Setting>
      tableName="system_settings"
      title={t("admin.nav.system")}
      subtitle={t("admin.desc.system")}
      orderBy="key"
      searchFields={["key", "value"]}
      emptyValues={{ company_id: null, key: "", value: null, description: null }}
      validate={(v) => {
        if (!v.key?.trim()) return t("admin.sys.err.key");
        return null;
      }}
      columns={[
        { key: "key", header: t("admin.sys.key"), className: "font-mono text-xs" },
        { key: "value", header: t("admin.sys.value"), className: "font-mono text-xs" },
        { key: "company_id", header: t("admin.org.company"), render: (r) => companyName(r.company_id) },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={t("admin.org.company")}>
            <CompanySelect value={values.company_id} onChange={(v) => setValue("company_id", v as any)} />
            <p className="text-xs text-muted-foreground mt-1">{t("admin.sys.companyHint")}</p>
          </FormField>
          <FormField label={`${t("admin.sys.key")} *`}>
            <Input value={values.key ?? ""} onChange={(e) => setValue("key", e.target.value)} placeholder="default_language, timezone, base_currency..." />
          </FormField>
          <FormField label={t("admin.sys.value")}>
            <Input value={values.value ?? ""} onChange={(e) => setValue("value", e.target.value || null)} />
          </FormField>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
