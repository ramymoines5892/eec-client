import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/job-titles")({
  component: JobTitlesPage,
});

type JobTitle = {
  id: string;
  company_id: string;
  code: string;
  name: string;
  grade: string | null;
  description: string | null;
};

function JobTitlesPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <SimpleCrud<JobTitle>
      tableName="job_titles"
      title={t("admin.org.jobTitles")}
      subtitle={t("admin.org.jobTitles.desc")}
      orderBy="code"
      searchFields={["code", "name"]}
      emptyValues={{ company_id: "", code: "", name: "", grade: null, description: null }}
      validate={(v) => {
        if (!v.company_id) return t("admin.err.company");
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.name?.trim()) return t("admin.err.name");
        return null;
      }}
      columns={[
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs" },
        { key: "name", header: t("admin.org.col.name") },
        { key: "grade", header: t("admin.org.grade") },
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
          <FormField label={t("admin.org.grade")}>
            <Input value={values.grade ?? ""} onChange={(e) => setValue("grade", e.target.value || null)} />
          </FormField>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
