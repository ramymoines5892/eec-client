import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/prototype/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { useT } from "@/prototype/i18n";
import { usePrototypeStore } from "@/prototype/store";

export const Route = createFileRoute("/language")({
  head: () => ({ meta: [{ title: "Language — EEC Prototype" }] }),
  component: LanguagePage,
});

function LanguagePage() {
  const t = useT();
  const setLanguage = usePrototypeStore((s) => s.setLanguage);
  const nav = useNavigate();
  const choose = (l: "en" | "ar") => {
    setLanguage(l);
    nav({ to: "/setup-landing" });
  };
  return (
    <AuthLayout title={t("lang.title")} subtitle={t("lang.subtitle")}>
      <div className="grid gap-3">
        <Button size="lg" onClick={() => choose("en")}>{t("lang.en")}</Button>
        <Button size="lg" variant="outline" onClick={() => choose("ar")}>{t("lang.ar")}</Button>
      </div>
    </AuthLayout>
  );
}
