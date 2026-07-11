import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Database } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/master-data/")({
  component: MasterDataIndex,
});

function MasterDataIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.masterData")} subtitle={t("admin.desc.masterData")}>
      <EmptyState icon={Database} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
