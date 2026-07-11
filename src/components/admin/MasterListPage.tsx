import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download } from "lucide-react";
import { useT } from "@/prototype/i18n";

export interface MasterListPageProps {
  title: string;
  subtitle?: string;
  search?: string;
  onSearchChange?: (v: string) => void;
  onCreate?: () => void;
  createLabel?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  onExport?: () => void;
}

export function MasterListPage({
  title, subtitle, search, onSearchChange, onCreate, createLabel,
  filters, actions, children, onExport,
}: MasterListPageProps) {
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1.5" />
              {t("admin.actions.export")}
            </Button>
          )}
          {onCreate && (
            <Button size="sm" onClick={onCreate}>
              <Plus className="h-4 w-4 mr-1.5" />
              {createLabel ?? t("admin.actions.create")}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center">
            {onSearchChange && (
              <div className="relative min-w-0 sm:max-w-sm">
                <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t("admin.actions.search")}
                  className="ps-8"
                />
              </div>
            )}
            {filters && (
              <details className="sm:relative">
                <summary className="list-none inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-accent">
                  <Filter className="h-4 w-4" />
                  {t("admin.actions.filter")}
                </summary>
                <div className="mt-2 rounded-md border bg-popover p-3 space-y-2 shadow-sm">
                  {filters}
                </div>
              </details>
            )}
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, action }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-10 w-10 text-muted-foreground/60 mb-3" />
      <h3 className="text-sm font-semibold">{title}</h3>
      {body && <p className="text-xs text-muted-foreground mt-1 max-w-sm">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
