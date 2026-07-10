import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
});

function ForgotPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) throw error;
      toast.success(t("toast.resetSent"));
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(t("toast.error"), { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.forgot.title")} subtitle={t("auth.forgot.body")}>
      {sent ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-md bg-muted p-3 text-sm">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate">{email}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("toast.resetSent")}</p>
          <Link to="/auth/login"><Button variant="outline" className="w-full">{t("common.back")}</Button></Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t("auth.forgot.submit")}
          </Button>
          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-primary hover:underline">{t("common.back")}</Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
