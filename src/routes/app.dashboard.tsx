import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EEC Prototype" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const t = useT();
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-semibold">{t("shell.dashboard")}</h1>
      <div className="mt-6 rounded-lg border bg-background p-10 text-center">
        <h2 className="text-lg font-medium">{t("dashboard.empty.title")}</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t("dashboard.empty.body")}</p>
      </div>
    </div>
  );
}
