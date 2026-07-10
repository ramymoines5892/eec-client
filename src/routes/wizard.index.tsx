import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";

export const Route = createFileRoute("/wizard/")({
  component: WelcomePage,
});

function WelcomePage() {
  const t = useT();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("wizard.welcome.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("wizard.welcome.body")}</p>
      <div className="mt-6">
        <Link to="/wizard/company"><Button size="lg">{t("wizard.welcome.start")}</Button></Link>
      </div>
    </div>
  );
}
