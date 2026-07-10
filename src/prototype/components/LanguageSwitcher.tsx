import { usePrototypeStore } from "../store";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = usePrototypeStore();
  return (
    <div className="inline-flex rounded-md border border-border overflow-hidden text-sm">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 ${language === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1.5 ${language === "ar" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        ع
      </button>
    </div>
  );
}

export function ResetButton() {
  const reset = usePrototypeStore((s) => s.reset);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        reset();
        window.location.href = "/";
      }}
    >
      Reset
    </Button>
  );
}
