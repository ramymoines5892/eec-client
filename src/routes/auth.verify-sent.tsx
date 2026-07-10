import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/auth/verify-sent")({
  component: VerifySentPage,
});

function VerifySentPage() {
  const t = useT();
  const email = usePrototypeStore((s) => s.ownerEmail);
  return (
    <AuthLayout title={t("auth.verifySent.title")} subtitle={t("auth.verifySent.body")}>
      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground truncate">{email}</div>
      <Link to="/auth/verify-result"><Button className="w-full">{t("auth.verifySent.open")}</Button></Link>
    </AuthLayout>
  );
}
