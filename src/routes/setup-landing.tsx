import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/setup-landing")({
  head: () => ({ meta: [{ title: "Welcome — EEC Prototype" }] }),
  component: LandingPage,
});

function LandingPage() {
  const t = useT();
  return (
    <AuthLayout title={t("landing.title")} subtitle={t("landing.subtitle")}>
      <div className="grid gap-3">
        <Link to="/auth/email"><Button size="lg" className="w-full">{t("landing.setup")}</Button></Link>
        <Link to="/auth/login"><Button size="lg" variant="outline" className="w-full">{t("landing.signin")}</Button></Link>
      </div>
    </AuthLayout>
  );
}
