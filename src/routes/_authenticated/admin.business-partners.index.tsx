import { createFileRoute } from "@tanstack/react-router";
import { MasterListPage, EmptyState } from "@/components/admin/MasterListPage";
import { Users } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/business-partners/")({
  component: BusinessPartnersIndex,
});

function BusinessPartnersIndex() {
  const t = useT();
  return (
    <MasterListPage title={t("admin.nav.businessPartners")} subtitle={t("admin.desc.businessPartners")}>
      <EmptyState icon={Users} title={t("admin.stub.title")} body={t("admin.stub.body")} />
    </MasterListPage>
  );
}
