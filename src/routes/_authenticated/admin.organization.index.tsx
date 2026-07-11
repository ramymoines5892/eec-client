import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Network, Briefcase, Users, ChevronRight } from "lucide-react";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/organization/")({
  component: OrganizationIndex,
});

function OrganizationIndex() {
  const t = useT();
  const modules: { to: any; icon: any; title: string; desc: string }[] = [
    { to: "/admin/organization/companies", icon: Building2, title: t("admin.org.companies"), desc: t("admin.org.companies.desc") },
    { to: "/admin/organization/branches", icon: MapPin, title: t("admin.org.branches"), desc: t("admin.org.branches.desc") },
    { to: "/admin/organization/departments", icon: Network, title: t("admin.org.departments"), desc: t("admin.org.departments.desc") },
    { to: "/admin/organization/job-titles", icon: Briefcase, title: t("admin.org.jobTitles"), desc: t("admin.org.jobTitles.desc") },
    { to: "/admin/organization/employees", icon: Users, title: t("admin.org.employees"), desc: t("admin.org.employees.desc") },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t("admin.nav.organization")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("admin.desc.organization")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {modules.map((m) => (
          <Link key={m.title} to={m.to}>
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">{m.title}</h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
