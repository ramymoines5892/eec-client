import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { FileText } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/templates/")({
  component: TemplatesIndex,
});

function TemplatesIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.templates")} subtitle={t("admin.desc.templates")}>
      <EmptyState icon={FileText} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
