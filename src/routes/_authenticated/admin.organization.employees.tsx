import { createFileRoute } from "@tanstack/react-router";
import { SimpleCrud, FormField } from "@/components/admin/SimpleCrud";
import { Input } from "@/components/ui/input";
import { CompanySelect, useCompanies } from "@/components/admin/CompanySelect";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/employees")({
  component: EmployeesPage,
});

type Employee = {
  id: string;
  company_id: string;
  employee_no: string;
  full_name: string;
  full_name_ar: string | null;
  email: string | null;
  phone: string | null;
  hire_date: string | null;
};

function EmployeesPage() {
  const t = useT();
  const { data: companies = [] } = useCompanies();
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "—";

  return (
    <SimpleCrud<Employee>
      tableName="employees"
      title={t("admin.org.employees")}
      subtitle={t("admin.org.employees.desc")}
      orderBy="employee_no"
      searchFields={["employee_no", "full_name", "email"]}
      emptyValues={{
        company_id: "", employee_no: "", full_name: "", full_name_ar: null,
        email: null, phone: null, hire_date: null,
      }}
      validate={(v) => {
        if (!v.company_id) return t("admin.err.company");
        if (!v.employee_no?.trim()) return t("admin.err.employeeNo");
        if (!v.full_name?.trim()) return t("admin.err.name");
        return null;
      }}
      columns={[
        { key: "employee_no", header: t("admin.org.employeeNo"), className: "font-mono text-xs" },
        { key: "full_name", header: t("admin.org.col.name") },
        { key: "email", header: t("common.email") },
        { key: "company_id", header: t("admin.org.company"), render: (r) => companyName(r.company_id) },
      ]}
      renderForm={({ values, setValue }) => (
        <>
          <FormField label={`${t("admin.org.company")} *`}>
            <CompanySelect value={values.company_id} onChange={(v) => setValue("company_id", v)} />
          </FormField>
          <FormField label={`${t("admin.org.employeeNo")} *`}>
            <Input value={values.employee_no ?? ""} onChange={(e) => setValue("employee_no", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={`${t("admin.ref.name.en")} *`}>
              <Input value={values.full_name ?? ""} onChange={(e) => setValue("full_name", e.target.value)} />
            </FormField>
            <FormField label={t("admin.ref.name.ar")}>
              <Input dir="rtl" value={values.full_name_ar ?? ""} onChange={(e) => setValue("full_name_ar", e.target.value || null)} />
            </FormField>
          </div>
          <FormField label={t("common.email")}>
            <Input type="email" value={values.email ?? ""} onChange={(e) => setValue("email", e.target.value || null)} />
          </FormField>
          <FormField label={t("common.telephone")}>
            <Input value={values.phone ?? ""} onChange={(e) => setValue("phone", e.target.value || null)} />
          </FormField>
          <FormField label={t("admin.org.hireDate")}>
            <Input type="date" value={values.hire_date ?? ""} onChange={(e) => setValue("hire_date", e.target.value || null)} />
          </FormField>
        </>
      )}
    />
  );
}
