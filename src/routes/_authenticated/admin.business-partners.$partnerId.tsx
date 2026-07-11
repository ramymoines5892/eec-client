import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/_authenticated/admin/business-partners/$partnerId")({
  component: PartnerDetail,
});

const ROLES = ["customer", "vendor", "manufacturer", "agent", "carrier", "insurance", "bank", "government"] as const;

function PartnerDetail() {
  const t = useT();
  const lang = usePrototypeStore((s) => s.language);
  const { partnerId } = Route.useParams();
  const qc = useQueryClient();

  const { data: partner } = useQuery({
    queryKey: ["business_partner", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("business_partners").select("*").eq("id", partnerId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["business_partner_roles", partnerId],
    queryFn: async () => {
      const { data, error } = await supabase.from("business_partner_roles").select("*").eq("partner_id", partnerId);
      if (error) throw error;
      return data as { id: string; role: string; is_active: boolean }[];
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ role, enable }: { role: string; enable: boolean }) => {
      const existing = roles.find((r) => r.role === role);
      if (enable) {
        if (existing) {
          const { error } = await supabase.from("business_partner_roles").update({ is_active: true }).eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("business_partner_roles").insert({ partner_id: partnerId, role, is_active: true });
          if (error) throw error;
        }
      } else {
        if (existing) {
          const { error } = await supabase.from("business_partner_roles").update({ is_active: false }).eq("id", existing.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business_partner_roles", partnerId] });
      qc.invalidateQueries({ queryKey: ["business_partner_roles_map"] });
      toast.success(t("admin.ref.updated"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isActive = (role: string) => roles.find((r) => r.role === role)?.is_active ?? false;
  const title = partner ? (lang === "ar" ? (partner.legal_name_ar ?? partner.legal_name) : partner.legal_name) : "";

  return (
    <div className="space-y-4">
      <Link to="/admin/business-partners">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 me-1.5" />
          {t("admin.nav.businessPartners")}
        </Button>
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
          {partner && <Badge variant="outline" className="font-mono">{partner.code}</Badge>}
        </div>
        {partner?.trade_name && <p className="text-sm text-muted-foreground mt-0.5">{partner.trade_name}</p>}
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-sm font-semibold">{t("admin.bp.roles")}</h2>
          <p className="text-xs text-muted-foreground">{t("admin.bp.rolesHint")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ROLES.map((role) => (
              <div key={role} className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">{t(`admin.bp.role.${role}`)}</span>
                <Switch
                  checked={isActive(role)}
                  onCheckedChange={(v) => toggleRole.mutate({ role, enable: v })}
                  disabled={toggleRole.isPending}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {partner && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold mb-3">{t("admin.tabs.details")}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">{t("admin.bp.taxNo")}</dt>
                <dd>{partner.tax_number ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{t("admin.bp.regNo")}</dt>
                <dd>{partner.registration_number ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{t("common.email")}</dt>
                <dd>{partner.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{t("common.telephone")}</dt>
                <dd>{partner.phone ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">{t("common.address")}</dt>
                <dd>{partner.address ?? "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
