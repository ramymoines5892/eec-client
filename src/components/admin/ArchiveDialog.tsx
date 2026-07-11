import { ConfirmationDialog, type ConfirmationDialogProps } from "./ConfirmationDialog";
import { useT } from "@/prototype/i18n";

type ArchiveDialogProps = Omit<ConfirmationDialogProps, "title" | "description" | "destructive"> & {
  entityLabel?: string;
};

export function ArchiveDialog({ entityLabel, ...rest }: ArchiveDialogProps) {
  const t = useT();
  return (
    <ConfirmationDialog
      {...rest}
      title={t("admin.dialogs.archive.title")}
      description={
        entityLabel
          ? `${t("admin.dialogs.archive.body")} — ${entityLabel}`
          : t("admin.dialogs.archive.body")
      }
      confirmLabel={t("admin.dialogs.archive.confirm")}
      destructive
    />
  );
}
