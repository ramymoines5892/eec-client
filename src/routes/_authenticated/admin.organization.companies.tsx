import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/companies")({
  component: CompaniesPage,
});

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
};

function CompaniesPage() {
  const t = useT();
  return (
    <SimpleCrud<Company>
      tableName="companies"
      title={t("admin.org.companies")}
      subtitle={t("admin.org.companies.desc")}
      orderBy="name"
      searchFields={["name", "email"]}
      emptyValues={{ name: "", email: null, phone: null, website: null, address: null }}
      validate={(v) => (!v.name?.trim() ? t("admin.err.name") : null)}
      columns={[
        { key: "name", header: t("admin.org.col.name") },
        { key: "email", header: t("common.email") },
        { key: "phone", header: t("common.telephone") },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.org.col.name")} *`}>
            <Input value={values.name ?? ""} onChange={(e) => setValue("name", e.target.value)} />
          </FormField>
          <FormField label={t("common.email")}>
            <Input type="email" value={values.email ?? ""} onChange={(e) => setValue("email", e.target.value || null)} />
          </FormField>
          <FormField label={t("common.telephone")}>
            <Input value={values.phone ?? ""} onChange={(e) => setValue("phone", e.target.value || null)} />
          </FormField>
          <FormField label={t("admin.org.website")}>
            <Input value={values.website ?? ""} onChange={(e) => setValue("website", e.target.value || null)} />
          </FormField>
          <FormField label={t("common.address")}>
            <Textarea rows={2} value={values.address ?? ""} onChange={(e) => setValue("address", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
