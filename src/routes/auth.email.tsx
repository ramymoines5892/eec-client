import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useState } from "react";

export const Route = createFileRoute("/auth/email")({
  component: EmailPage,
});

function EmailPage() {
  const t = useT();
  const nav = useNavigate();
  const { ownerEmail, setOwnerEmail } = usePrototypeStore();
  const [email, setEmail] = useState(ownerEmail);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setOwnerEmail(email);
    nav({ to: "/auth/verify-sent" });
  };
  return (
    <AuthLayout title={t("auth.email.title")} subtitle={t("auth.email.hint")}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("common.email")}</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <Button type="submit" className="w-full">{t("auth.email.send")}</Button>
      </form>
    </AuthLayout>
  );
}
