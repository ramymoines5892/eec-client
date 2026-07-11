import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Shield } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/security/")({
  component: SecurityIndex,
});

function SecurityIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.security")} subtitle={t("admin.desc.security")}>
      <EmptyState icon={Shield} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
