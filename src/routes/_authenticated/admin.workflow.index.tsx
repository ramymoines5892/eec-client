import { createFileRoute, Link } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/workflow/")({
  component: WorkflowPage,
});

type Template = {
  id: string;
  company_id: string;
  code: string;
  name: string;
  module: string;
  description: string | null;
  is_active: boolean;
};

function WorkflowPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <SimpleCrud<Template>
      tableName="workflow_templates"
      title={t("admin.nav.workflow")}
      subtitle={t("admin.desc.workflow")}
      orderBy="code"
      searchFields={["code", "name", "module"]}
      emptyValues={{ company_id: "", code: "", name: "", module: "", description: null, is_active: true }}
      validate={(v) => {
        if (!v.company_id) return t("admin.err.company");
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.name?.trim()) return t("admin.err.name");
        if (!v.module?.trim()) return t("admin.num.err.module");
        return null;
      }}
      columns={[
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs" },
        { key: "name", header: t("admin.org.col.name") },
        { key: "module", header: t("admin.num.module"), className: "font-mono text-xs" },
        { key: "company_id", header: t("admin.org.company"), render: (r) => companyName(r.company_id) },
        {
          key: "id", header: "",
          render: (r) => (
            <Link to="/admin/workflow/$templateId" params={{ templateId: r.id }}>
              <Button variant="ghost" size="icon" title={t("admin.wf.manageSteps")}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ),
        },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.org.company")} *`}>
            <CompanySelect value={values.company_id} onChange={(v) => setValue("company_id", v)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`${t("admin.ref.col.code")} *`}>
              <Input value={values.code ?? ""} onChange={(e) => setValue("code", e.target.value)} />
            </FormField>
            <FormField label={`${t("admin.num.module")} *`}>
              <Input value={values.module ?? ""} onChange={(e) => setValue("module", e.target.value)} placeholder="sales, purchasing..." />
            </FormField>
          </div>
          <FormField label={`${t("admin.org.col.name")} *`}>
            <Input value={values.name ?? ""} onChange={(e) => setValue("name", e.target.value)} />
          </FormField>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">{t("admin.ref.active")}</span>
            <Switch checked={values.is_active ?? true} onCheckedChange={(v) => setValue("is_active", v as any)} />
          </div>
        </>
      )}
    />
  );
}
