import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/wizard/position")({
  component: PositionPage,
});

function PositionPage() {
  const t = useT();
  const nav = useNavigate();
  const { employee, mainBranch, orgUnits, assignPosition } = usePrototypeStore();
  const unit = orgUnits.find((u) => u.id === employee?.organizationalUnitId);
  const confirm = () => { assignPosition(); nav({ to: "/wizard/review" }); };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("position.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("position.body")}</p>
      <div className="rounded-md border bg-muted/50 p-4 text-sm space-y-2">
        <div><span className="text-muted-foreground">{t("common.fullName")}: </span>{employee?.fullName ?? "—"}</div>
        <div><span className="text-muted-foreground">{t("employee.jobTitle")}: </span>{employee?.jobTitle ?? "—"}</div>
        <div><span className="text-muted-foreground">{t("employee.orgUnit")}: </span>{unit?.name ?? "—"}</div>
        <div><span className="text-muted-foreground">{t("employee.primaryBranch")}: </span>{mainBranch?.name ?? "—"}</div>
        <div><span className="text-muted-foreground">{t("employee.startDate")}: </span>{employee?.positionEffectiveStartDate ?? "—"}</div>
      </div>
      <div className="flex justify-between pt-4">
        <Link to="/wizard/employee"><Button type="button" variant="outline">{t("common.back")}</Button></Link>
        <Button onClick={confirm}>{t("position.assign")}</Button>
      </div>
    </div>
  );
}
