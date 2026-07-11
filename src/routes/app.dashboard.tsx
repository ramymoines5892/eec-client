import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/prototype/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EEC" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const t = useT();
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">{t("shell.dashboard")}</h1>

      <Link to="/admin" className="block">
        <Card className="hover:border-primary transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Settings2 className="h-5 w-5 text-primary shrink-0" />
                <CardTitle className="text-base truncate">{t("admin.title")}</CardTitle>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 rtl:rotate-180" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("admin.home.subtitle")}</p>
          </CardContent>
        </Card>
      </Link>

      <div className="rounded-lg border bg-background p-10 text-center">
        <h2 className="text-lg font-medium">{t("dashboard.empty.title")}</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t("dashboard.empty.body")}</p>
      </div>
    </div>
  );
}
