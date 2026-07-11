import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/languages/")({
  component: LanguagesPage,
});

type Language = {
  id: string;
  code: string;
  name_en: string;
  name_native: string;
  is_rtl: boolean;
  is_active: boolean;
  sort_order: number;
};

function LanguagesPage() {
  const t = useT();
  return (
    <SimpleCrud<Language>
      tableName="languages"
      title={t("admin.nav.languages")}
      subtitle={t("admin.desc.languages")}
      orderBy="sort_order"
      searchFields={["code", "name_en", "name_native"]}
      emptyValues={{ code: "", name_en: "", name_native: "", is_rtl: false, is_active: true, sort_order: 100 }}
      validate={(v) => {
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.name_en?.trim() || !v.name_native?.trim()) return t("admin.err.name");
        return null;
      }}
      columns={[
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs w-24" },
        { key: "name_en", header: t("admin.lang.nameEn") },
        { key: "name_native", header: t("admin.lang.nameNative") },
        { key: "is_rtl", header: t("admin.lang.rtl"), render: (r) => r.is_rtl ? <Badge variant="secondary">RTL</Badge> : "—" },
        { key: "is_active", header: t("admin.ref.active"), render: (r) => r.is_active ? "✓" : "—" },
        { key: "sort_order", header: "#", className: "font-mono w-16" },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <div className="grid grid-cols-3 gap-3">
            <FormField label={`${t("admin.ref.col.code")} *`}>
              <Input value={values.code ?? ""} onChange={(e) => setValue("code", e.target.value.toLowerCase())} placeholder="en" />
            </FormField>
            <FormField label={t("admin.lang.sort")}>
              <Input type="number" value={values.sort_order ?? 100} onChange={(e) => setValue("sort_order", Number(e.target.value) as any)} />
            </FormField>
          </div>
          <FormField label={`${t("admin.lang.nameEn")} *`}>
            <Input value={values.name_en ?? ""} onChange={(e) => setValue("name_en", e.target.value)} />
          </FormField>
          <FormField label={`${t("admin.lang.nameNative")} *`}>
            <Input value={values.name_native ?? ""} onChange={(e) => setValue("name_native", e.target.value)} />
          </FormField>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">{t("admin.lang.rtl")}</span>
            <Switch checked={values.is_rtl ?? false} onCheckedChange={(v) => setValue("is_rtl", v as any)} />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">{t("admin.ref.active")}</span>
            <Switch checked={values.is_active ?? true} onCheckedChange={(v) => setValue("is_active", v as any)} />
          </div>
        </>
      )}
    />
  );
}
