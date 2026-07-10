import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/verify-result")({
  component: VerifyResultPage,
});

function VerifyResultPage() {
  const t = useT();
  const markVerified = usePrototypeStore((s) => s.markEmailVerified);
  useEffect(() => { markVerified(); }, [markVerified]);
  return (
    <AuthLayout title={t("auth.verifyResult.title")} subtitle={t("auth.verifyResult.body")}>
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm">{t("common.email")} ✓</span>
      </div>
      <Link to="/auth/create-password"><Button className="w-full">{t("auth.verifyResult.next")}</Button></Link>
    </AuthLayout>
  );
}
