import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { readinessChecklist, usePrototypeStore } from "@/prototype/store";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/wizard/checklist")({
  component: ChecklistPage,
});

function ChecklistPage() {
  const t = useT();
  const nav = useNavigate();
  const store = usePrototypeStore();
  const items = readinessChecklist(store);
  const allDone = items.every((i) => i.done);
  const labels: Record<string, string> = {
    email: t("checklist.email"),
    password: t("checklist.password"),
    company: t("checklist.company"),
    branch: t("checklist.branch"),
    employee: t("checklist.employee"),
    position: t("checklist.position"),
  };
  const activate = () => {
    if (!allDone) return;
    store.activateWorkspace();
    nav({ to: "/wizard/success" });
  };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("checklist.title")}</h1>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3 min-w-0">
              {it.done ? <Check className="h-5 w-5 text-green-600 shrink-0" /> : <X className="h-5 w-5 text-destructive shrink-0" />}
              <span className="truncate">{labels[it.id]}</span>
            </div>
            {!it.done && (
              <Link to={it.route}><Button size="sm" variant="outline">{t("common.completeNow")}</Button></Link>
            )}
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <Button size="lg" className="w-full" disabled={!allDone} onClick={activate}>
          {allDone ? t("checklist.activate") : t("checklist.blocked")}
        </Button>
      </div>
    </div>
  );
}
