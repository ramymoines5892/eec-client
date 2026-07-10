import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/wizard/success")({
  component: SuccessPage,
});

function SuccessPage() {
  const t = useT();
  return (
    <div className="text-center space-y-5 py-8">
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
      <h1 className="text-2xl font-semibold">{t("success.title")}</h1>
      <p className="text-muted-foreground">{t("success.body")}</p>
      <Link to="/app/dashboard"><Button size="lg">{t("success.enter")}</Button></Link>
    </div>
  );
}
