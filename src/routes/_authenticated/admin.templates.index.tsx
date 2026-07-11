import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/templates/")({
  component: TemplatesPage,
});

type Template = {
  id: string;
  entity_type: string;
  code: string;
  name: string;
  description: string | null;
  fields: any;
  is_active: boolean;
};

function fieldCount(fields: any): number {
  if (Array.isArray(fields)) return fields.length;
  return 0;
}

function TemplatesPage() {
  const t = useT();
  return (
    <SimpleCrud<Template>
      tableName="attribute_templates"
      title={t("admin.nav.templates")}
      subtitle={t("admin.desc.templates")}
      orderBy="entity_type"
      searchFields={["entity_type", "code", "name"]}
      emptyValues={{ entity_type: "", code: "", name: "", description: null, fields: [], is_active: true }}
      validate={(v) => {
        if (!v.entity_type?.trim()) return t("admin.tmpl.err.entity");
        if (!v.code?.trim()) return t("admin.err.code");
        if (!v.name?.trim()) return t("admin.err.name");
        try {
          const parsed = typeof v.fields === "string" ? JSON.parse(v.fields) : v.fields;
          if (!Array.isArray(parsed)) return t("admin.tmpl.err.json");
        } catch {
          return t("admin.tmpl.err.json");
        }
        return null;
      }}
      columns={[
        { key: "entity_type", header: t("admin.tmpl.entity"), className: "font-mono text-xs" },
        { key: "code", header: t("admin.ref.col.code"), className: "font-mono text-xs" },
        { key: "name", header: t("admin.org.col.name") },
        { key: "fields", header: t("admin.tmpl.fields"), render: (r) => <Badge variant="secondary">{fieldCount(r.fields)}</Badge> },
        { key: "is_active", header: t("admin.ref.active"), render: (r) => r.is_active ? "✓" : "—" },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`${t("admin.tmpl.entity")} *`}>
              <Input value={values.entity_type ?? ""} onChange={(e) => setValue("entity_type", e.target.value)} placeholder="item, customer, po..." />
            </FormField>
            <FormField label={`${t("admin.ref.col.code")} *`}>
              <Input value={values.code ?? ""} onChange={(e) => setValue("code", e.target.value)} />
            </FormField>
          </div>
          <FormField label={`${t("admin.org.col.name")} *`}>
            <Input value={values.name ?? ""} onChange={(e) => setValue("name", e.target.value)} />
          </FormField>
          <FormField label={t("admin.ref.description")}>
            <Textarea rows={2} value={values.description ?? ""} onChange={(e) => setValue("description", e.target.value || null)} />
          </FormField>
          <FormField label={t("admin.tmpl.fields")}>
            <Textarea
              rows={8}
              className="font-mono text-xs"
              value={typeof values.fields === "string" ? values.fields : JSON.stringify(values.fields ?? [], null, 2)}
              onChange={(e) => {
                const raw = e.target.value;
                try {
                  const parsed = JSON.parse(raw);
                  setValue("fields", parsed as any);
                } catch {
                  setValue("fields", raw as any);
                }
              }}
              placeholder='[{"key":"color","label":"Color","type":"text","required":true}]'
            />
            <p className="text-xs text-muted-foreground mt-1">{t("admin.tmpl.fieldsHint")}</p>
          </FormField>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm">{t("admin.ref.active")}</span>
            <Switch checked={values.is_active ?? true} onCheckedChange={(v) => setValue("is_active", v as any)} />
          </div>
        </>
      )}
    />
  );
}
