import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/numbering/")({
  component: NumberingPage,
});

type Sequence = {
  id: string;
  company_id: string;
  module: string;
  doc_type: string;
  prefix: string;
  suffix: string;
  padding: number;
  next_value: number;
  reset_policy: string;
  is_active: boolean;
  description: string | null;
};

const RESET_POLICIES = ["never", "yearly", "monthly"];

function preview(v: Partial<Sequence>) {
  const pad = Math.max(0, Number(v.padding ?? 5));
  const n = String(v.next_value ?? 1).padStart(pad, "0");
  return `${v.prefix ?? ""}${n}${v.suffix ?? ""}`;
}

function NumberingPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <SimpleCrud<Sequence>
      tableName="numbering_sequences"
      title={t("admin.nav.numbering")}
      subtitle={t("admin.desc.numbering")}
      orderBy="module"
      searchFields={["module", "doc_type", "prefix"]}
      emptyValues={{
        company_id: "", module: "", doc_type: "", prefix: "", suffix: "",
        padding: 5, next_value: 1, reset_policy: "never", is_active: true, description: null,
      }}
      validate={(v) => {
        if (!v.company_id) return t("admin.err.company");
        if (!v.module?.trim()) return t("admin.num.err.module");
        if (!v.doc_type?.trim()) return t("admin.num.err.docType");
        return null;
      }}
      columns={[
        { key: "module", header: t("admin.num.module"), className: "font-mono text-xs" },
        { key: "doc_type", header: t("admin.num.docType"), className: "font-mono text-xs" },
        { key: "id", header: t("admin.num.preview"), render: (r) => <span className="font-mono text-xs">{preview(r)}</span> },
        { key: "reset_policy", header: t("admin.num.reset") },
        { key: "company_id", header: t("admin.org.company"), render: (r) => companyName(r.company_id) },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.org.company")} *`}>
            <CompanySelect value={values.company_id} onChange={(v) => setValue("company_id", v)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`${t("admin.num.module")} *`}>
              <Input value={values.module ?? ""} onChange={(e) => setValue("module", e.target.value)} placeholder="sales, purchasing..." />
            </FormField>
            <FormField label={`${t("admin.num.docType")} *`}>
              <Input value={values.doc_type ?? ""} onChange={(e) => setValue("doc_type", e.target.value)} placeholder="PO, SO, INV..." />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label={t("admin.num.prefix")}>
              <Input value={values.prefix ?? ""} onChange={(e) => setValue("prefix", e.target.value)} />
            </FormField>
            <FormField label={t("admin.num.suffix")}>
              <Input value={values.suffix ?? ""} onChange={(e) => setValue("suffix", e.target.value)} />
            </FormField>
            <FormField label={t("admin.num.padding")}>
              <Input type="number" min={0} max={12} value={values.padding ?? 5} onChange={(e) => setValue("padding", Number(e.target.value) as any)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={t("admin.num.next")}>
              <Input type="number" min={1} value={values.next_value ?? 1} onChange={(e) => setValue("next_value", Number(e.target.value) as any)} />
            </FormField>
            <FormField label={t("admin.num.reset")}>
              <Select value={values.reset_policy ?? "never"} onValueChange={(v) => setValue("reset_policy", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RESET_POLICIES.map((p) => <SelectItem key={p} value={p}>{t(`admin.num.reset.${p}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="rounded-md border p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">{t("admin.num.preview")}</div>
            <div className="font-mono text-sm">{preview(values)}</div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">{t("admin.ref.active")}</span>
            <Switch checked={values.is_active ?? true} onCheckedChange={(v) => setValue("is_active", v as any)} />
          </div>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
