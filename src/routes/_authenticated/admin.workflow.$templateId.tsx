import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/workflow/$templateId")({
  component: WorkflowStepsPage,
});

type Step = {
  id: string;
  template_id: string;
  step_no: number;
  name: string;
  role_required: string | null;
  min_approvers: number;
  is_optional: boolean;
};

function WorkflowStepsPage() {
  const t = useT();
  const { templateId } = Route.useParams();

  const { data: template } = useQuery({
    queryKey: ["workflow_template", templateId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("workflow_templates").select("*").eq("id", templateId).single();
      if (error) throw error;
      return data as { id: string; code: string; name: string; module: string };
    },
  });

  return (
    <div className="space-y-4">
      <Link to="/admin/workflow">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 me-1.5" />
          {t("admin.nav.workflow")}
        </Button>
      </Link>

      <SimpleCrud<Step>
        tableName="workflow_steps"
        title={template ? `${template.code} — ${template.name}` : t("admin.wf.steps")}
        subtitle={t("admin.wf.stepsHint")}
        orderBy="step_no"
        searchFields={["name", "role_required"]}
        emptyValues={{ template_id: templateId, step_no: 1, name: "", role_required: null, min_approvers: 1, is_optional: false }}
        validate={(v) => {
          if (!v.step_no) return t("admin.wf.err.stepNo");
          if (!v.name?.trim()) return t("admin.err.name");
          return null;
        }}
        columns={[
          { key: "step_no", header: "#", className: "w-12 font-mono" },
          { key: "name", header: t("admin.org.col.name") },
          { key: "role_required", header: t("admin.wf.role"), render: (r) => r.role_required ?? "—" },
          { key: "min_approvers", header: t("admin.wf.minApprovers"), className: "font-mono" },
          { key: "is_optional", header: t("admin.wf.optional"), render: (r) => r.is_optional ? "✓" : "—" },
        ]}
        renderForm={({ values, setValue }) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={`${t("admin.wf.stepNo")} *`}>
                <Input type="number" min={1} value={values.step_no ?? 1} onChange={(e) => setValue("step_no", Number(e.target.value) as any)} />
              </FormField>
              <FormField label={t("admin.wf.minApprovers")}>
                <Input type="number" min={1} value={values.min_approvers ?? 1} onChange={(e) => setValue("min_approvers", Number(e.target.value) as any)} />
              </FormField>
            </div>
            <FormField label={`${t("admin.org.col.name")} *`}>
              <Input value={values.name ?? ""} onChange={(e) => setValue("name", e.target.value)} />
            </FormField>
            <FormField label={t("admin.wf.role")}>
              <Input value={values.role_required ?? ""} onChange={(e) => setValue("role_required", e.target.value || null)} placeholder="manager, finance, admin..." />
            </FormField>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">{t("admin.wf.optional")}</span>
              <Switch checked={values.is_optional ?? false} onCheckedChange={(v) => setValue("is_optional", v as any)} />
            </div>
          </>
        )}
      />
    </div>
  );
}
