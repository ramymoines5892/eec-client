import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { PasswordField } from "@/prototype/components/PasswordField";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const t = useT();
  const nav = useNavigate();
  const store = usePrototypeStore();
  const [email, setEmail] = useState(store.ownerEmail);
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error(t("toast.emailNotVerified"));
        } else {
          toast.error(t("toast.invalidCreds"));
        }
        return;
      }
      if (data.user) {
        store.setOwnerEmail(email);
        store.markEmailVerified();
        store.markPasswordCreated();
        toast.success(t("toast.signedIn"));
        nav({ to: store.state.workspace === "ACTIVE" ? "/app/dashboard" : "/wizard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(t("toast.error"), { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.login.title")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("common.email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1.5"
          />
        </div>
        <PasswordField value={pw} onChange={setPw} label={t("common.password")} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {t("auth.login.submit")}
        </Button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/auth/forgot" className="text-primary hover:underline">
            {t("auth.login.forgot")}
          </Link>
          <Link to="/auth/email" className="text-muted-foreground hover:text-foreground">
            {t("landing.setup")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
