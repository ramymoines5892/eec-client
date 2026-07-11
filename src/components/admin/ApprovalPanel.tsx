import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "./MasterListPage";
import { useT } from "@/prototype/i18n";

export function ApprovalPanel({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  const t = useT();
  // TODO: wire to entity_approvals + workflow definitions (Phase 3 / 6)
  void entityType; void entityId;
  return (
    <div className="rounded-md border bg-card">
      <EmptyState icon={CheckCircle2} title={t("admin.panels.approvals.empty")} body={t("admin.panels.approvals.body")} />
    </div>
  );
}
