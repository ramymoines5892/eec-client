import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify-result")({
  component: VerifyResultPage,
});

function VerifyResultPage() {
  const t = useT();
  const nav = useNavigate();
  const { markEmailVerified, state } = usePrototypeStore();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Supabase magic-link sets the session automatically on redirect
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error || !data.session) {
        setError(error?.message ?? "Verification link is invalid or has expired.");
        setStatus("error");
        return;
      }
      markEmailVerified();
      setStatus("ok");
      // If password already set, go to wizard; otherwise send to create password
      setTimeout(() => {
        nav({ to: state.credential === "SET" ? "/wizard" : "/auth/create-password" });
      }, 900);
    })();
    return () => {
      cancelled = true;
    };
  }, [markEmailVerified, nav, state.credential]);

  if (status === "loading") {
    return (
      <AuthLayout title={t("auth.verifyResult.title")}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>...</span>
        </div>
      </AuthLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthLayout title={t("toast.error")} subtitle={error}>
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
        <Link to="/auth/email"><Button className="w-full">{t("auth.email.send")}</Button></Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.verifyResult.title")} subtitle={t("auth.verifyResult.body")}>
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm">{t("common.email")} ✓</span>
      </div>
    </AuthLayout>
  );
}
