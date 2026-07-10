import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useState } from "react";

export const Route = createFileRoute("/auth/create-password")({
  component: CreatePasswordPage,
});

function CreatePasswordPage() {
  const t = useT();
  const nav = useNavigate();
  const mark = usePrototypeStore((s) => s.markPasswordCreated);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setErr("Min 8 characters");
    if (pw !== pw2) return setErr("Passwords do not match");
    mark();
    nav({ to: "/wizard" });
  };
  return (
    <AuthLayout title={t("auth.createPassword.title")} subtitle={t("auth.createPassword.hint")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>{t("common.password")}</Label>
          <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required className="mt-1.5" />
        </div>
        <div>
          <Label>{t("common.confirmPassword")}</Label>
          <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required className="mt-1.5" />
        </div>
        {err && <div className="text-sm text-destructive">{err}</div>}
        <Button type="submit" className="w-full">{t("auth.createPassword.submit")}</Button>
      </form>
    </AuthLayout>
  );
}
