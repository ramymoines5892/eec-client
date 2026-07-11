import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/email")({
  component: EmailPage,
});

function EmailPage() {
  const t = useT();
  const nav = useNavigate();
  const { ownerEmail, setOwnerEmail } = usePrototypeStore();
  const [email, setEmail] = useState(ownerEmail);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error(t("toast.error"), { description: "Invalid email address" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/verify-result`,
        },
      });
      if (error) throw error;
      setOwnerEmail(email);
      toast.success(t("toast.checkEmail"), { description: t("toast.emailSent") });
      nav({ to: "/auth/verify-sent" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(t("toast.error"), { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.email.title")} subtitle={t("auth.email.hint")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("common.email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1.5"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {t("auth.email.send")}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">
            {t("landing.signin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
