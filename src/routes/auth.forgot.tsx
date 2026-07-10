import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { useState } from "react";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
});

function ForgotPage() {
  const t = useT();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <AuthLayout title={t("auth.forgot.title")} subtitle={t("auth.forgot.body")}>
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/auth/reset" }); }} className="space-y-4">
        <div>
          <Label>{t("common.email")}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full">{t("auth.forgot.submit")}</Button>
      </form>
    </AuthLayout>
  );
}
