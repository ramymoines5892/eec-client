import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/_authenticated/admin/security/")({
  component: SecurityPage,
});

const ROLES = ["admin", "manager", "procurement", "sales", "warehouse", "finance", "viewer", "moderator", "user"] as const;

type Profile = { id: string; email: string | null; full_name: string | null };
type UserRole = { id: string; user_id: string; role: string };

function SecurityPage() {
  const t = useT();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleChoice, setRoleChoice] = useState<Record<string, string>>({});

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles-security"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,email,full_name").order("email");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["user_roles_all"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("user_roles").select("id,user_id,role");
      if (error) throw error;
      return data as UserRole[];
    },
  });

  const addRole = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: string }) => {
      const { error } = await (supabase as any).from("user_roles").insert({ user_id, role });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["user_roles_all"] }); toast.success(t("admin.ref.updated")); },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["user_roles_all"] }); toast.success(t("admin.ref.deleted")); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rolesByUser = roles.reduce<Record<string, UserRole[]>>((acc, r) => {
    (acc[r.user_id] ||= []).push(r); return acc;
  }, {});

  const filtered = profiles.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.email ?? "").toLowerCase().includes(q) || (p.full_name ?? "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t("admin.nav.security")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("admin.desc.security")}</p>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="relative max-w-sm">
            <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("admin.actions.search")} className="ps-8" />
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("common.loading")}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">{t("admin.sec.noUsers")}</div>
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => {
                const userRoles = rolesByUser[p.id] ?? [];
                const chosen = roleChoice[p.id] ?? "";
                const available = ROLES.filter((r) => !userRoles.some((ur) => ur.role === r));
                return (
                  <div key={p.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{p.full_name ?? p.email ?? p.id}</div>
                        {p.email && <div className="text-xs text-muted-foreground truncate">{p.email}</div>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {userRoles.map((r) => (
                        <Badge key={r.id} variant="secondary" className="gap-1 pe-1">
                          {r.role}
                          <button
                            onClick={() => removeRole.mutate(r.id)}
                            className="rounded-full hover:bg-muted p-0.5"
                            title={t("admin.actions.delete")}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {userRoles.length === 0 && <span className="text-xs text-muted-foreground">{t("admin.sec.noRoles")}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={chosen} onValueChange={(v) => setRoleChoice((s) => ({ ...s, [p.id]: v }))}>
                        <SelectTrigger className="h-8 max-w-[200px]"><SelectValue placeholder={t("admin.sec.addRole")} /></SelectTrigger>
                        <SelectContent>
                          {available.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!chosen || addRole.isPending}
                        onClick={() => {
                          addRole.mutate({ user_id: p.id, role: chosen });
                          setRoleChoice((s) => ({ ...s, [p.id]: "" }));
                        }}
                      >
                        <Plus className="h-3.5 w-3.5 me-1" />
                        {t("admin.actions.add")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
