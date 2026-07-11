import { GitCommit } from "lucide-react";
import { EmptyState } from "./MasterListPage";
import { useT } from "@/prototype/i18n";

export function RevisionPanel({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  const t = useT();
  // TODO: wire to entity_revisions table (Phase 3)
  void entityType; void entityId;
  return (
    <div className="rounded-md border bg-card">
      <EmptyState icon={GitCommit} title={t("admin.panels.revisions.empty")} body={t("admin.panels.revisions.body")} />
    </div>
  );
}
