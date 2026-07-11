import { MessageSquare } from "lucide-react";
import { EmptyState } from "./MasterListPage";
import { useT } from "@/prototype/i18n";

export function CommentPanel({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  const t = useT();
  // TODO: wire to entity_comments table (Phase 3)
  void entityType; void entityId;
  return (
    <div className="rounded-md border bg-card">
      <EmptyState icon={MessageSquare} title={t("admin.panels.comments.empty")} body={t("admin.panels.comments.body")} />
    </div>
  );
}
