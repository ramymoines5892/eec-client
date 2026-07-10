import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/wizard/review")({
  component: ReviewPage,
});

function ReviewPage() {
  const t = useT();
  const { company, mainBranch, employee, orgUnits } = usePrototypeStore();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t("review.title")}</h1>
      <Section title={t("company.title")} editTo="/wizard/company" t={t}>
        <Row k={t("company.legalName")} v={company?.legalName} />
        <Row k={t("company.displayName")} v={company?.displayName} />
        <Row k={t("company.code")} v={company?.companyCode} />
        <Row k={t("common.country")} v={company?.country} />
        <Row k={t("company.functionalCurrency")} v={company?.functionalCurrency} />
        <Row k={t("financial.transaction")} v={company?.transactionCurrencies?.join(", ")} />
      </Section>
      <Section title={t("branch.title")} editTo="/wizard/branch" t={t}>
        <Row k={t("branch.name")} v={mainBranch?.name} />
        <Row k={t("branch.code")} v={mainBranch?.code} />
        <Row k={t("common.city")} v={mainBranch?.city} />
      </Section>
      <Section title={t("org.title")} editTo="/wizard/org" t={t}>
        <Row k="Units" v={orgUnits.map((u) => u.name).join(", ")} />
      </Section>
      <Section title={t("employee.title")} editTo="/wizard/employee" t={t}>
        <Row k={t("common.fullName")} v={employee?.fullName} />
        <Row k={t("employee.jobTitle")} v={employee?.jobTitle} />
        <Row k={t("employee.startDate")} v={employee?.positionEffectiveStartDate} />
      </Section>
      <div className="flex justify-between pt-4">
        <Link to="/wizard/position"><Button variant="outline">{t("common.back")}</Button></Link>
        <Link to="/wizard/checklist"><Button>{t("common.continue")}</Button></Link>
      </div>
    </div>
  );
}

function Section({ title, editTo, t, children }: { title: string; editTo: string; t: (k: string) => string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">{title}</h2>
        <Link to={editTo} className="text-sm text-primary hover:underline">{t("review.edit")}</Link>
      </div>
      <dl className="space-y-1 text-sm">{children}</dl>
    </div>
  );
}
function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground min-w-[140px]">{k}:</dt>
      <dd className="text-foreground">{v || "—"}</dd>
    </div>
  );
}
