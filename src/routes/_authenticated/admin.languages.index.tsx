import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Languages } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/languages/")({
  component: LanguagesIndex,
});

function LanguagesIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.languages")} subtitle={t("admin.desc.languages")}>
      <EmptyState icon={Languages} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
