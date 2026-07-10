import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PrototypeBanner } from "./PrototypeBanner";
import { LanguageSwitcher, ResetButton } from "./LanguageSwitcher";
import { useApplyDirection, useT } from "../i18n";
import { usePrototypeStore } from "../store";
import { LayoutDashboard, FileText, Package, ShoppingCart, Warehouse, TrendingUp, ShieldCheck, DollarSign } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  useApplyDirection();
  const t = useT();
  const company = usePrototypeStore((s) => s.company);
  const branch = usePrototypeStore((s) => s.mainBranch);

  const navItems = [
    { key: "shell.dashboard", to: "/app/dashboard", icon: LayoutDashboard, enabled: true },
    { key: "shell.nav.rfq", to: "#", icon: FileText, enabled: false },
    { key: "shell.nav.products", to: "#", icon: Package, enabled: false },
    { key: "shell.nav.procurement", to: "#", icon: ShoppingCart, enabled: false },
    { key: "shell.nav.inventory", to: "#", icon: Warehouse, enabled: false },
    { key: "shell.nav.sales", to: "#", icon: TrendingUp, enabled: false },
    { key: "shell.nav.quality", to: "#", icon: ShieldCheck, enabled: false },
    { key: "shell.nav.finance", to: "#", icon: DollarSign, enabled: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <PrototypeBanner />
      <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-background">
        <div className="min-w-0 flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            {(company?.displayName ?? "E").slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">
              {company?.displayName ?? t("app.name")}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {t("shell.currentBranch")}: {branch?.name ?? "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <ResetButton />
        </div>
      </header>
      <div className="flex-1 grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b lg:border-b-0 lg:border-e bg-background px-3 py-3 lg:py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <div
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                    item.enabled
                      ? "hover:bg-muted text-foreground"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(item.key)}</span>
                  </span>
                  {!item.enabled && (
                    <span className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded shrink-0 ms-2">
                      {t("shell.comingLater")}
                    </span>
                  )}
                </div>
              );
              return item.enabled ? (
                <Link key={item.key} to={item.to}>{content}</Link>
              ) : (
                <div key={item.key}>{content}</div>
              );
            })}
          </nav>
        </aside>
        <main className="px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
