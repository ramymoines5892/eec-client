import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useState } from "react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const t = useT();
  const nav = useNavigate();
  const store = usePrototypeStore();
  const [email, setEmail] = useState(store.ownerEmail);
  const [pw, setPw] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated login only
    if (store.state.workspace === "ACTIVE") nav({ to: "/app/dashboard" });
    else nav({ to: "/wizard" });
  };
  return (
    <AuthLayout title={t("auth.login.title")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>{t("common.email")}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
        </div>
        <div>
          <Label>{t("common.password")}</Label>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full">{t("auth.login.submit")}</Button>
        <div className="text-center">
          <Link to="/auth/forgot" className="text-sm text-primary underline-offset-4 hover:underline">
            {t("auth.login.forgot")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
