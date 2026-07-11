import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { BookOpen } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/reference-data/")({
  component: ReferenceDataIndex,
});

function ReferenceDataIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.referenceData")} subtitle={t("admin.desc.referenceData")}>
      <EmptyState icon={BookOpen} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
