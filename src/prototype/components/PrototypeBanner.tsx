import { useT } from "../i18n";

export function PrototypeBanner() {
  const t = useT();
  return (
    <div className="w-full bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs py-1.5 px-4 text-center border-b border-amber-500/30">
      {t("banner.prototype")}
    </div>
  );
}
