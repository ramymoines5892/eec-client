import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2, Users, Database, BookOpen, GitBranch, Hash,
  Shield, Languages, FileText, Settings, LayoutDashboard, ChevronDown,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { useT } from "@/prototype/i18n";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

export function AdminSidebar() {
  const t = useT();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  const items: NavItem[] = [
    { title: t("admin.nav.dashboard"), url: "/admin", icon: LayoutDashboard },
    { title: t("admin.nav.organization"), url: "/admin/organization", icon: Building2 },
    { title: t("admin.nav.businessPartners"), url: "/admin/business-partners", icon: Users },
    { title: t("admin.nav.masterData"), url: "/admin/master-data", icon: Database },
    { title: t("admin.nav.referenceData"), url: "/admin/reference-data", icon: BookOpen },
    { title: t("admin.nav.workflow"), url: "/admin/workflow", icon: GitBranch },
    { title: t("admin.nav.numbering"), url: "/admin/numbering", icon: Hash },
    { title: t("admin.nav.security"), url: "/admin/security", icon: Shield },
    { title: t("admin.nav.languages"), url: "/admin/languages", icon: Languages },
    { title: t("admin.nav.templates"), url: "/admin/templates", icon: FileText },
    { title: t("admin.nav.system"), url: "/admin/system", icon: Settings },
  ];

  const isActive = (url: string) =>
    url === "/admin" ? currentPath === "/admin" : currentPath.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground font-bold">E</div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{t("app.name")}</div>
              <div className="truncate text-[10px] text-muted-foreground">{t("admin.title")}</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("admin.groups.administration")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
