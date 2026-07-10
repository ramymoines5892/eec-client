import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { COUNTRIES, generateCode } from "@/prototype/catalogs";
import { useState } from "react";

export const Route = createFileRoute("/wizard/branch")({
  component: BranchPage,
});

function BranchPage() {
  const t = useT();
  const nav = useNavigate();
  const { mainBranch, setMainBranch, company } = usePrototypeStore();
  const [form, setForm] = useState({
    name: mainBranch?.name ?? (company?.displayName ? `${company.displayName} — Main` : "Main"),
    code: mainBranch?.code ?? generateCode("BR"),
    country: mainBranch?.country ?? company?.country ?? "EG",
    city: mainBranch?.city ?? "",
    address: mainBranch?.address ?? "",
    telephone: mainBranch?.telephone ?? "",
    email: mainBranch?.email ?? "",
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMainBranch({ ...form, isMain: true });
    nav({ to: "/wizard/financial" });
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("branch.title")}</h1>
      <div className="text-xs bg-muted rounded-md px-3 py-2">✓ {t("branch.isMain")}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>{t("branch.name")}</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
        <div><Label>{t("branch.code")}</Label><Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="mt-1.5" /></div>
        <div><Label>{t("common.country")}</Label>
          <select className="w-full mt-1.5 border border-input bg-background rounded-md h-9 px-3 text-sm" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <div><Label>{t("common.city")}</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1.5" /></div>
      </div>
      <div><Label>{t("common.address")}</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1.5" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>{t("common.telephone")}</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="mt-1.5" /></div>
        <div><Label>{t("common.email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
      </div>
      <div className="flex justify-between pt-4">
        <Link to="/wizard/company"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  );
}
