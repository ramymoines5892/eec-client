import type { ReactNode } from "react";
import { PrototypeBanner } from "./PrototypeBanner";
import { LanguageSwitcher, ResetButton } from "./LanguageSwitcher";
import { useApplyDirection, useT } from "../i18n";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  useApplyDirection();
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <PrototypeBanner />
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b bg-background">
        <div className="min-w-0">
          <div className="font-semibold text-foreground truncate">{t("app.name")}</div>
          <div className="text-xs text-muted-foreground truncate">{t("app.tagline")}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <ResetButton />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-6 space-y-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
