// Prototype-only static catalogs. Not a production reference data model.
export const COUNTRIES = [
  { code: "EG", name: "Egypt" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

export const TIMEZONES = [
  "Africa/Cairo",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
];

export const CURRENCIES = ["EGP", "EUR", "USD", "GBP", "SAR", "AED"];

export const DEFAULT_FUNCTIONAL_CURRENCY = "EGP";
export const DEFAULT_TRANSACTION_CURRENCIES = ["EGP", "EUR", "USD", "GBP"];

export const SUGGESTED_ORG_UNITS = [
  "General Management",
  "Sales",
  "Procurement",
  "Warehouse",
  "Finance",
  "Quality",
  "Human Resources",
];

export function generateCode(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
}
