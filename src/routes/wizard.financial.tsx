import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { CURRENCIES } from "@/prototype/catalogs";

export const Route = createFileRoute("/wizard/financial")({
  component: FinancialPage,
});

function FinancialPage() {
  const t = useT();
  const nav = useNavigate();
  const { company, setCompany } = usePrototypeStore();
  const tx = company?.transactionCurrencies ?? [];
  const toggle = (c: string) => {
    if (!company) return;
    const next = tx.includes(c) ? tx.filter((x) => x !== c) : [...tx, c];
    setCompany({ ...company, transactionCurrencies: next });
  };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("financial.title")}</h1>
      <div>
        <Label>{t("financial.functional")}</Label>
        <div className="mt-1.5 rounded-md bg-muted px-3 py-2 text-sm">{company?.functionalCurrency ?? "—"}</div>
      </div>
      <div>
        <Label>{t("financial.transaction")}</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CURRENCIES.map((c) => {
            const active = tx.includes(c);
            return (
              <button key={c} type="button" onClick={() => toggle(c)}
                className={`px-3 py-1.5 rounded-md text-sm border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"}`}>
                {c}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("financial.note")}</p>
      </div>
      <div className="flex justify-between pt-4">
        <Link to="/wizard/branch"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <Button onClick={() => nav({ to: "/wizard/org" })}>{t("common.save")}</Button>
      </div>
    </div>
  );
}
