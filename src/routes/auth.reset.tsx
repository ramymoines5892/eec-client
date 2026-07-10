import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { useState } from "react";

export const Route = createFileRoute("/auth/reset")({
  component: ResetPage,
});

function ResetPage() {
  const t = useT();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  return (
    <AuthLayout title={t("auth.reset.title")}>
      <form onSubmit={(e) => { e.preventDefault(); if (pw && pw === pw2) nav({ to: "/auth/login" }); }} className="space-y-4">
        <div><Label>{t("common.password")}</Label><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required className="mt-1.5" /></div>
        <div><Label>{t("common.confirmPassword")}</Label><Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required className="mt-1.5" /></div>
        <Button type="submit" className="w-full">{t("auth.reset.submit")}</Button>
      </form>
    </AuthLayout>
  );
}
