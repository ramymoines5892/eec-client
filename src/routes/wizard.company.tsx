import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { COUNTRIES, TIMEZONES, CURRENCIES, DEFAULT_FUNCTIONAL_CURRENCY, DEFAULT_TRANSACTION_CURRENCIES, generateCode } from "@/prototype/catalogs";
import { useState } from "react";

export const Route = createFileRoute("/wizard/company")({
  component: CompanyPage,
});

function CompanyPage() {
  const t = useT();
  const nav = useNavigate();
  const { company, setCompany } = usePrototypeStore();
  const [form, setForm] = useState({
    legalName: company?.legalName ?? "",
    displayName: company?.displayName ?? "",
    country: company?.country ?? "EG",
    timeZone: company?.timeZone ?? "Africa/Cairo",
    functionalCurrency: company?.functionalCurrency ?? DEFAULT_FUNCTIONAL_CURRENCY,
    companyCode: company?.companyCode ?? generateCode("CO"),
    transactionCurrencies: company?.transactionCurrencies ?? DEFAULT_TRANSACTION_CURRENCIES,
    taxRegistrationNumber: company?.taxRegistrationNumber ?? "",
    commercialRegistrationNumber: company?.commercialRegistrationNumber ?? "",
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany(form);
    nav({ to: "/wizard/branch" });
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("company.title")}</h1>
      <Field label={t("company.legalName")} required>
        <Input required value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
      </Field>
      <Field label={t("company.displayName")} required>
        <Input required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
      </Field>
      <Field label={t("company.code")} required>
        <Input required value={form.companyCode} onChange={(e) => setForm({ ...form, companyCode: e.target.value })} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("common.country")} required>
          <select className="w-full border border-input bg-background rounded-md h-9 px-3 text-sm" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </Field>
        <Field label={t("company.timeZone")} required>
          <select className="w-full border border-input bg-background rounded-md h-9 px-3 text-sm" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })}>
            {TIMEZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </Field>
      </div>
      <Field label={t("company.functionalCurrency")} required>
        <select className="w-full border border-input bg-background rounded-md h-9 px-3 text-sm" value={form.functionalCurrency} onChange={(e) => setForm({ ...form, functionalCurrency: e.target.value })}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label={t("company.tax")}><Input value={form.taxRegistrationNumber} onChange={(e) => setForm({ ...form, taxRegistrationNumber: e.target.value })} /></Field>
      <Field label={t("company.cr")}><Input value={form.commercialRegistrationNumber} onChange={(e) => setForm({ ...form, commercialRegistrationNumber: e.target.value })} /></Field>
      <div className="flex justify-between pt-4">
        <Link to="/wizard"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  const t = useT();
  return (
    <div>
      <Label className="flex items-center gap-2">
        {label}
        <span className="text-xs text-muted-foreground">{required ? `(${t("common.required")})` : `(${t("common.optional")})`}</span>
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
