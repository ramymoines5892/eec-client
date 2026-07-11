import { Paperclip } from "lucide-react";
import { EmptyState } from "./MasterListPage";
import { useT } from "@/prototype/i18n";

export function AttachmentPanel({ entityType, entityId }: { entityType?: string; entityId?: string }) {
  const t = useT();
  // TODO: wire to entity_attachments + Supabase Storage bucket (Phase 3)
  void entityType; void entityId;
  return (
    <div className="rounded-md border bg-card">
      <EmptyState icon={Paperclip} title={t("admin.panels.attachments.empty")} body={t("admin.panels.attachments.body")} />
    </div>
  );
}
