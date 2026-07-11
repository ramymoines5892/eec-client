import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { GitBranch } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/workflow/")({
  component: WorkflowIndex,
});

function WorkflowIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.workflow")} subtitle={t("admin.desc.workflow")}>
      <EmptyState icon={GitBranch} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
