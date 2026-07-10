import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useT, useLang } from "../i18n";

export interface PasswordRule {
  id: string;
  label: string;
  test: (v: string) => boolean;
}

export const passwordRules = (labels: Record<string, string>): PasswordRule[] => [
  { id: "len", label: labels.len, test: (v) => v.length >= 8 },
  { id: "upper", label: labels.upper, test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: labels.lower, test: (v) => /[a-z]/.test(v) },
  { id: "digit", label: labels.digit, test: (v) => /\d/.test(v) },
];

export function isPasswordValid(v: string) {
  return v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
}

export function PasswordField({
  value,
  onChange,
  label,
  showChecklist = false,
  autoComplete = "current-password",
  id = "password",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  showChecklist?: boolean;
  autoComplete?: string;
  id?: string;
}) {
  const t = useT();
  const lang = useLang();
  const [show, setShow] = useState(false);
  const rules = passwordRules({
    len: t("pw.rule.len"),
    upper: t("pw.rule.upper"),
    lower: t("pw.rule.lower"),
    digit: t("pw.rule.digit"),
  });

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className={lang === "ar" ? "pl-10" : "pr-10"}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t("pw.hide") : t("pw.show")}
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
            lang === "ar" ? "left-3" : "right-3"
          }`}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showChecklist && (
        <ul className="mt-2 space-y-1 text-xs">
          {rules.map((r) => {
            const ok = r.test(value);
            return (
              <li
                key={r.id}
                className={`flex items-center gap-2 transition-colors ${
                  ok ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
                }`}
              >
                {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                <span>{r.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
