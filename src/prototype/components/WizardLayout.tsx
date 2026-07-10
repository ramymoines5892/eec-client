import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PrototypeBanner } from "./PrototypeBanner";
import { LanguageSwitcher, ResetButton } from "./LanguageSwitcher";
import { useApplyDirection, useT } from "../i18n";
import { readinessChecklist, usePrototypeStore } from "../store";
import { Check, Circle } from "lucide-react";

const STEPS = [
  { path: "/wizard/company", key: "wizard.step.company" },
  { path: "/wizard/branch", key: "wizard.step.branch" },
  { path: "/wizard/financial", key: "wizard.step.financial" },
  { path: "/wizard/org", key: "wizard.step.org" },
  { path: "/wizard/employee", key: "wizard.step.employee" },
  { path: "/wizard/position", key: "wizard.step.position" },
  { path: "/wizard/review", key: "wizard.step.review" },
  { path: "/wizard/checklist", key: "wizard.step.checklist" },
];

export function WizardLayout({ children }: { children: ReactNode }) {
  useApplyDirection();
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const store = usePrototypeStore();
  const checklist = readinessChecklist(store);
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <PrototypeBanner />
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b bg-background">
        <div className="min-w-0">
          <div className="font-semibold text-foreground truncate">{t("app.name")}</div>
          <div className="text-xs text-muted-foreground truncate">{t("wizard.progress")}: {doneCount}/{checklist.length}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <ResetButton />
        </div>
      </header>
      <div className="flex-1 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-0">
        <aside className="border-b lg:border-b-0 lg:border-e bg-background px-4 py-4 lg:py-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            {t("wizard.progress")}
          </div>
          <ol className="space-y-1">
            {STEPS.map((s) => {
              const active = pathname === s.path;
              return (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Circle className="h-3 w-3 shrink-0" />
                    <span className="truncate">{t(s.key)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>
        <main className="px-4 sm:px-8 py-6 sm:py-10">
          <div className="max-w-2xl mx-auto bg-background border border-border rounded-lg p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
