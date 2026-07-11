import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { useT } from "@/prototype/i18n";
import { HistoryPanel } from "./HistoryPanel";
import { ApprovalPanel } from "./ApprovalPanel";
import { RevisionPanel } from "./RevisionPanel";
import { AttachmentPanel } from "./AttachmentPanel";
import { CommentPanel } from "./CommentPanel";

export type LifecycleStatus =
  | "draft" | "review" | "approved" | "released" | "inactive" | "archived";

export interface MasterDetailsPageProps {
  title: string;
  subtitle?: string;
  status?: LifecycleStatus;
  backTo?: string;
  actions?: ReactNode;
  children: ReactNode;
  entityType?: string;
  entityId?: string;
}

const statusVariant: Record<LifecycleStatus, "secondary" | "default" | "outline" | "destructive"> = {
  draft: "outline",
  review: "secondary",
  approved: "default",
  released: "default",
  inactive: "secondary",
  archived: "destructive",
};

export function MasterDetailsPage({
  title, subtitle, status, backTo, actions, children, entityType, entityId,
}: MasterDetailsPageProps) {
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 min-w-0">
          {backTo && (
            <Link to={backTo}>
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
              {status && (
                <Badge variant={statusVariant[status]} className="shrink-0">
                  {t(`admin.status.${status}`)}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="details">{t("admin.tabs.details")}</TabsTrigger>
          <TabsTrigger value="history">{t("admin.tabs.history")}</TabsTrigger>
          <TabsTrigger value="attachments">{t("admin.tabs.attachments")}</TabsTrigger>
          <TabsTrigger value="revisions">{t("admin.tabs.revisions")}</TabsTrigger>
          <TabsTrigger value="approvals">{t("admin.tabs.approvals")}</TabsTrigger>
          <TabsTrigger value="comments">{t("admin.tabs.comments")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">{children}</TabsContent>
        <TabsContent value="history" className="mt-4">
          <HistoryPanel entityType={entityType} entityId={entityId} />
        </TabsContent>
        <TabsContent value="attachments" className="mt-4">
          <AttachmentPanel entityType={entityType} entityId={entityId} />
        </TabsContent>
        <TabsContent value="revisions" className="mt-4">
          <RevisionPanel entityType={entityType} entityId={entityId} />
        </TabsContent>
        <TabsContent value="approvals" className="mt-4">
          <ApprovalPanel entityType={entityType} entityId={entityId} />
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          <CommentPanel entityType={entityType} entityId={entityId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
