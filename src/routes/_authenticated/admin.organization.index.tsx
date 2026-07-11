import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Building2 } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/")({
  component: OrganizationIndex,
});

function OrganizationIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.organization")} subtitle={t("admin.desc.organization")}>
      <EmptyState icon={Building2} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
