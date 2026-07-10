import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { generateCode } from "@/prototype/catalogs";
import { useState } from "react";

export const Route = createFileRoute("/wizard/employee")({
  component: EmployeePage,
});

function EmployeePage() {
  const t = useT();
  const nav = useNavigate();
  const { employee, setEmployee, mainBranch, orgUnits } = usePrototypeStore();
  const units = orgUnits.length ? orgUnits : [{ id: "u0", name: "General Management" }];
  const [form, setForm] = useState({
    fullName: employee?.fullName ?? "",
    employeeCode: employee?.employeeCode ?? generateCode("EMP"),
    primaryBranchCode: employee?.primaryBranchCode ?? mainBranch?.code ?? "",
    organizationalUnitId: employee?.organizationalUnitId ?? units[0].id,
    jobTitle: employee?.jobTitle ?? "System Owner",
    positionEffectiveStartDate: employee?.positionEffectiveStartDate ?? new Date().toISOString().slice(0, 10),
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployee(form);
    nav({ to: "/wizard/position" });
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("employee.title")}</h1>
      <div><Label>{t("common.fullName")}</Label><Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>{t("employee.code")}</Label><Input required value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} className="mt-1.5" /></div>
        <div><Label>{t("employee.primaryBranch")}</Label><Input readOnly value={form.primaryBranchCode} className="mt-1.5 bg-muted" /></div>
        <div><Label>{t("employee.orgUnit")}</Label>
          <select className="w-full mt-1.5 border border-input bg-background rounded-md h-9 px-3 text-sm" value={form.organizationalUnitId} onChange={(e) => setForm({ ...form, organizationalUnitId: e.target.value })}>
            {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div><Label>{t("employee.jobTitle")}</Label><Input required value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="mt-1.5" /></div>
      </div>
      <div><Label>{t("employee.startDate")}</Label><Input type="date" required value={form.positionEffectiveStartDate} onChange={(e) => setForm({ ...form, positionEffectiveStartDate: e.target.value })} className="mt-1.5" /></div>
      <div className="flex justify-between pt-4">
        <Link to="/wizard/org"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <Button type="submit">{t("common.save")}</Button>
      </div>
    </form>
  );
}
