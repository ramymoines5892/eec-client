import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Hash } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/numbering/")({
  component: NumberingIndex,
});

function NumberingIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.numbering")} subtitle={t("admin.desc.numbering")}>
      <EmptyState icon={Hash} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
