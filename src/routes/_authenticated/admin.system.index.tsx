import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Settings } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/system/")({
  component: SystemIndex,
});

function SystemIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.system")} subtitle={t("admin.desc.system")}>
      <EmptyState icon={Settings} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
