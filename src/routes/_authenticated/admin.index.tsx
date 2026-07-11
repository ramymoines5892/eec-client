import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/prototype/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, Users, Database, BookOpen, GitBranch, Hash,
  Shield, Languages, FileText, Settings,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const t = useT();
  const modules = [
    { url: "/admin/organization", icon: Building2, key: "organization" },
    { url: "/admin/business-partners", icon: Users, key: "businessPartners" },
    { url: "/admin/master-data", icon: Database, key: "masterData" },
    { url: "/admin/reference-data", icon: BookOpen, key: "referenceData" },
    { url: "/admin/workflow", icon: GitBranch, key: "workflow" },
    { url: "/admin/numbering", icon: Hash, key: "numbering" },
    { url: "/admin/security", icon: Shield, key: "security" },
    { url: "/admin/languages", icon: Languages, key: "languages" },
    { url: "/admin/templates", icon: FileText, key: "templates" },
    { url: "/admin/system", icon: Settings, key: "system" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.home.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("admin.home.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modules.map((m) => (
          <Link key={m.url} to={m.url}>
            <Card className="hover:border-primary transition-colors h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <m.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t(`admin.nav.${m.key}`)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{t(`admin.desc.${m.key}`)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
