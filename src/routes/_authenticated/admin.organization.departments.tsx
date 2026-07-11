import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/departments")({
  component: DepartmentsPage,
});

type Department = {
  id: string;
  company_id: string;
  parent_id: string | null;
  code: string;
  name: string;
  description: string | null;
};

function DepartmentsPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <SimpleCrud<Department>
      tableName="departments"
      title={t("admin.org.departments")}
      subtitle={t("admin.org.departments.desc")}
      orderBy="code"
      searchFields={["code", "name"]}
      emptyValues={{ company_id: "", parent_id: null, code: "", name: "", description: null }}
      validate={(v) => {
        if (!v.company_id) return t("admin.err.company");
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.name?.trim()) return t("admin.err.name");
        return null;
      }}
      columns={[
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs" },
        { key: "name", header: t("admin.org.col.name") },
        { key: "company_id", header: t("admin.org.company"), render: (r) => companyName(r.company_id) },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.org.company")} *`}>
            <CompanySelect value={values.company_id} onChange={(v) => setValue("company_id", v)} />
          </FormField>
          <FormField label={`${t("admin.ref.col.code")} *`}>
            <Input value={values.code ?? ""} onChange={(e) => setValue("code", e.target.value)} />
          </FormField>
          <FormField label={`${t("admin.org.col.name")} *`}>
            <Input value={values.name ?? ""} onChange={(e) => setValue("name", e.target.value)} />
          </FormField>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
