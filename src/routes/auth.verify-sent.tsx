import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Mail, Loader2, Clock } from "lucide-react";

const OTP_TTL_SECONDS = 300; // 5 minutes

export const Route = createFileRoute("/auth/verify-sent")({
  component: VerifySentPage,
});

function VerifySentPage() {
  const t = useT();
  const nav = useNavigate();
  const email = usePrototypeStore((s) => s.ownerEmail);
  const markEmailVerified = usePrototypeStore((s) => s.markEmailVerified);
  const state = usePrototypeStore((s) => s.state);
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number>(() => Date.now() + OTP_TTL_SECONDS * 1000);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const expired = remaining === 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const resend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      toast.success(t("toast.emailSent"));
    } catch (err) {
      toast.error(t("toast.error"), { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setResending(false);
    }
  };

  const verify = async (token: string) => {
    if (!email || token.length !== 6) return;
    setVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (error) throw error;
      if (!data.session) throw new Error("No session returned");
      markEmailVerified();
      toast.success(t("toast.emailVerified"));
      nav({ to: state.credential === "SET" ? "/wizard" : "/auth/create-password" });
    } catch (err) {
      toast.error(t("toast.error"), { description: err instanceof Error ? err.message : String(err) });
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AuthLayout title={t("auth.verifySent.title")} subtitle={t("auth.otp.hint")}>
      <div className="flex items-center gap-3 rounded-md bg-muted p-3 text-sm">
        <Mail className="h-5 w-5 text-primary shrink-0" />
        <span className="truncate">{email || "—"}</span>
      </div>
      <div className="flex flex-col items-center gap-3 py-2">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            if (v.length === 6) verify(v);
          }}
          disabled={verifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {verifying && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> {t("auth.otp.verifying")}
          </div>
        )}
      </div>
      <Button onClick={resend} variant="outline" className="w-full" disabled={resending || !email || verifying}>
        {resending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {t("auth.otp.resend")}
      </Button>
      <div className="text-center text-sm">
        <Link to="/auth/email" className="text-primary hover:underline">
          {t("common.back")}
        </Link>
      </div>
    </AuthLayout>
  );
}
