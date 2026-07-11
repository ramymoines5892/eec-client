import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/verify-sent")({
  component: VerifySentPage,
});

function VerifySentPage() {
  const t = useT();
  const email = usePrototypeStore((s) => s.ownerEmail);
  const [resending, setResending] = useState(false);

  const resend = async () => {
    if (!email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/verify-result`,
        },
      });
      if (error) throw error;
      toast.success(t("toast.emailSent"));
    } catch (err) {
      toast.error(t("toast.error"), { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title={t("auth.verifySent.title")} subtitle={t("auth.verifySent.body")}>
      <div className="flex items-center gap-3 rounded-md bg-muted p-3 text-sm">
        <Mail className="h-5 w-5 text-primary shrink-0" />
        <span className="truncate">{email || "—"}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("auth.verifySent.hint")}
      </p>
      <Button onClick={resend} variant="outline" className="w-full" disabled={resending || !email}>
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
