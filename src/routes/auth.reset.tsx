import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PasswordField, isPasswordValid } from "@/prototype/components/PasswordField";

export const Route = createFileRoute("/auth/reset")({
  component: ResetPage,
});

function ResetPage() {
  const t = useT();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // On password recovery redirect, Supabase fires PASSWORD_RECOVERY event and sets a temporary session
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(pw)) return toast.error(t("pw.weak"));
    if (pw !== pw2) return toast.error(t("pw.mismatch"));
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      toast.success(t("toast.pwUpdated"));
      await supabase.auth.signOut();
      nav({ to: "/auth/login" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(t("toast.error"), { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const match = pw2.length > 0 && pw === pw2;

  return (
    <AuthLayout title={t("auth.reset.title")}>
      {!ready ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> ...
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <PasswordField id="new-password" value={pw} onChange={setPw} label={t("common.password")} showChecklist autoComplete="new-password" />
          <div>
            <PasswordField id="confirm-password" value={pw2} onChange={setPw2} label={t("common.confirmPassword")} autoComplete="new-password" />
            {pw2.length > 0 && (
              <p className={`mt-1.5 text-xs ${match ? "text-green-600" : "text-destructive"}`}>
                {match ? "✓" : "✗"} {match ? t("common.confirmPassword") : t("pw.mismatch")}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || !isPasswordValid(pw) || !match}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t("auth.reset.submit")}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
