import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore, type OrgUnit } from "@/prototype/store";
import { SUGGESTED_ORG_UNITS } from "@/prototype/catalogs";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/wizard/org")({
  component: OrgPage,
});

function OrgPage() {
  const t = useT();
  const nav = useNavigate();
  const { orgUnits, setOrgUnits } = usePrototypeStore();
  const [units, setUnits] = useState<OrgUnit[]>(
    orgUnits.length ? orgUnits : SUGGESTED_ORG_UNITS.map((n, i) => ({ id: `u${i}`, name: n }))
  );
  const [newName, setNewName] = useState("");
  const add = () => {
    if (!newName.trim()) return;
    setUnits([...units, { id: `u${Date.now()}`, name: newName.trim() }]);
    setNewName("");
  };
  const rename = (id: string, name: string) => setUnits(units.map((u) => u.id === id ? { ...u, name } : u));
  const remove = (id: string) => setUnits(units.filter((u) => u.id !== id));
  const save = () => { setOrgUnits(units); nav({ to: "/wizard/employee" }); };
  const skip = () => { setOrgUnits([{ id: "u0", name: "General Management" }]); nav({ to: "/wizard/employee" }); };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("org.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("org.body")}</p>
      <ul className="space-y-2">
        {units.map((u) => (
          <li key={u.id} className="flex items-center gap-2">
            <Input value={u.name} onChange={(e) => rename(u.id, e.target.value)} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(u.id)}><Trash2 className="h-4 w-4" /></Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input placeholder={t("org.add")} value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button type="button" onClick={add} variant="outline"><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-wrap justify-between gap-2 pt-4">
        <Link to="/wizard/financial"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={skip}>{t("common.skip")}</Button>
          <Button onClick={save}>{t("common.save")}</Button>
        </div>
      </div>
    </div>
  );
}
