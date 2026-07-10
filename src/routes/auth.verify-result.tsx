import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verify-result")({
  component: VerifyResultPage,
});

function VerifyResultPage() {
  const t = useT();
  const nav = useNavigate();
  const { markEmailVerified, state } = usePrototypeStore();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [error, setError] = useState<string>("");
  const done = useRef(false);

  useEffect(() => {
    const finish = (session: unknown) => {
      if (done.current || !session) return;
      done.current = true;
      markEmailVerified();
      setStatus("ok");
      setTimeout(() => {
        nav({ to: state.credential === "SET" ? "/wizard" : "/auth/create-password" });
      }, 700);
    };

    // 1) Listen for auth changes fired by detectSessionInUrl
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish(session);
    });

    // 2) Try to parse the URL hash/query manually (covers cases where the SDK didn't auto-detect)
    (async () => {
      try {
        const url = new URL(window.location.href);
        const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        const errDesc = hash.get("error_description") || url.searchParams.get("error_description");
        const code = url.searchParams.get("code");
        const token_hash = url.searchParams.get("token_hash");
        const type = url.searchParams.get("type");

        if (errDesc) {
          setError(errDesc);
          setStatus("error");
          return;
        }
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          finish(data.session);
          return;
        }
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          finish(data.session);
          return;
        }
        if (token_hash && type) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as any });
          if (error) throw error;
          finish(data.session);
          return;
        }

        // 3) Fallback: existing session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          finish(data.session);
        } else {
          // Give onAuthStateChange a moment; if nothing arrives, show error
          setTimeout(() => {
            if (!done.current) {
              setError("Verification link is invalid or has expired.");
              setStatus("error");
            }
          }, 2500);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();

    return () => {
      sub.subscription.unsubscribe();
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
        <div className="flex items-center gap-2 text-destructive mb-4">
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
