import { Clock } from "lucide-react";
import { EmptyState } from "./MasterListPage";
import { useT } from "@/prototype/i18n";

export function HistoryPanel({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  const t = useT();
  // TODO: wire to entity_history table once lifecycle engine ships (Phase 3)
  void entityType; void entityId;
  return (
    <div className="rounded-md border bg-card">
      <EmptyState icon={Clock} title={t("admin.panels.history.empty")} body={t("admin.panels.history.body")} />
    </div>
  );
}
