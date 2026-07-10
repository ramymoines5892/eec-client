# PROTOTYPE_01_README

## ⚠️ Warnings

- **This is a visual and interaction prototype only.**
- **No real authentication.** Email verification, password creation, login, forgot-password, and reset flows are **simulated**.
- **No real database.** No Supabase, no backend API, no SQL, no migrations were created for this prototype.
- **localStorage is a temporary prototype storage mechanism** (via Zustand `persist`). It is **not** the approved production state-management, database, or data-model architecture.
- **The prototype architecture is not the approved production architecture.** Do not derive production assumptions from it.
- Pre-existing Supabase files under `src/integrations/supabase/*` are **outside Prototype 01 scope** and are **not imported, called, configured, or relied upon** by any prototype screen or component.

## Purpose

Prototype 01 delivers the approved first-run experience for the EEC Enterprise Business Management platform:

1. Public/auth surface (language pick, setup landing, simulated email verification, password creation, login, forgot/reset).
2. Initial company setup wizard (company details, main branch, financial basics, suggested organization, System Owner employee profile, position assignment, review, activation readiness).
3. Basic responsive application shell with an empty dashboard and placeholder navigation showing future modules as **Coming Later**.

## Included Scope

- Language Selection, Setup Landing.
- Email Entry → Verification Sent → Verification Result → Create Password.
- Login, Forgot Password, Reset Password.
- Setup Welcome, Company Details, Main Branch, Financial Basics, Suggested Organization Structure, System Owner Employee Profile, Position Assignment, Setup Review, Activation Readiness Checklist, Activation Success.
- Responsive App Shell with company name, current branch, user language switcher, and placeholder navigation.
- Empty Dashboard.

## Excluded Scope (deferred to later approved packages)

- Employee / User / Invitation / Roles / Permission management.
- Approval Queue, Rejected Account Management, Security Policy Administration, Audit Log Viewer.
- Full Branch Administration, Full Organization Editor after setup.
- MFA, Currency Exchange Engine.
- Any RFQ / Product / Inventory / Procurement / Sales / Finance / Quality / Logistics / Certificate functionality.

## Screen Map

| # | Screen | Route |
|---|---|---|
| 1 | Language Selection | `/language` |
| 2 | Setup Landing | `/setup-landing` |
| 3 | System Owner Email Entry | `/auth/email` |
| 4 | Email Verification Sent | `/auth/verify-sent` |
| 5 | Email Verification Result | `/auth/verify-result` |
| 6 | Create Password | `/auth/create-password` |
| 7 | Login | `/auth/login` |
| 8 | Forgot Password | `/auth/forgot` |
| 9 | Reset Password | `/auth/reset` |
| 10 | Setup Welcome & Progress | `/wizard` |
| 11 | Company Details | `/wizard/company` |
| 12 | Main Branch | `/wizard/branch` |
| 13 | Financial Basics | `/wizard/financial` |
| 14 | Suggested Organization Structure | `/wizard/org` |
| 15 | System Owner Employee Profile | `/wizard/employee` |
| 16 | System Owner Position Assignment | `/wizard/position` |
| 17 | Setup Review | `/wizard/review` |
| 18 | Activation Readiness Checklist | `/wizard/checklist` |
| 19 | Activation Success | `/wizard/success` |
| 20 | Empty Dashboard (App Shell) | `/app/dashboard` |

## Navigation Flow

```
/  →  /language  →  /setup-landing
                       ├── /auth/login → /auth/forgot → /auth/reset → /auth/login
                       └── /auth/email → /auth/verify-sent → /auth/verify-result
                                       → /auth/create-password
                                       → /wizard  (welcome)
                                       → /wizard/company
                                       → /wizard/branch
                                       → /wizard/financial
                                       → /wizard/org
                                       → /wizard/employee
                                       → /wizard/position
                                       → /wizard/review
                                       → /wizard/checklist
                                              ├── [Complete Now] → back to the incomplete step
                                              └── [Activate Workspace] (only when all items ✓)
                                       → /wizard/success
                                       → /app/dashboard
```

## Mock-Data Behavior

- All state is held in a single Zustand store `src/prototype/store.ts` persisted under the localStorage key `eec_prototype_v1`.
- No network calls. No fetches. No server functions. No Supabase client is instantiated by any prototype screen.
- Independent state dimensions (User Identity, Email Verification, Credential, Approval, Access, Employee, Invitation, Workspace) are stored as **separate fields** and never collapsed. The UI may show a derived friendly label, but the underlying dimensions remain independent.
- Auto-generated codes (Company Code, Branch Code, Employee Code) are produced client-side and remain editable during setup.
- Suggested organization units and default currencies (`EGP` functional; `EGP/EUR/USD/GBP` transaction) are seeded as **guidance only**; when adopted they are copied into workspace-owned data.

## Reset Prototype Data

- Click the **Reset** button in the top-right of any prototype screen.
- Or run in the browser console: `localStorage.removeItem('eec_prototype_v1'); location.href = '/';`

## Arabic and English Behavior

- Toggle language from the header on every screen (EN / ع buttons) or from the initial Language Selection screen.
- All labels come from `src/prototype/i18n.ts` — no locale-specific hardcoded strings in components.
- Numbers are shown in Western digits for ERP consistency.

## RTL and LTR Behavior

- `<html dir>` and `<html lang>` are updated at runtime whenever the language changes (`useApplyDirection`).
- Layouts use logical Tailwind utilities (`ms-`, `me-`, `ps-`, `pe-`) so RTL flips automatically.
- No page reload is required for language/direction switching.

## Responsive Behavior

- Mobile-first, using Tailwind breakpoints `sm 640 / md 768 / lg 1024 / xl 1280`.
- Wizard: single column on mobile, sidebar + form on `lg+`.
- App Shell: navigation drawer stacks above content on mobile, becomes a fixed side navigation on `lg+`.
- All multi-item header rows use grid + `min-w-0` + `shrink-0` + `truncate` to survive small widths.

## Accessibility Considerations

- Every input has an associated `<Label>`.
- Language switcher and Reset are keyboard-focusable buttons.
- Focus rings inherit from the shadcn design tokens (never disabled).
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<ol>`, `<form>`) throughout.
- Errors on password creation are shown inline, not swallowed.
- Color contrast follows the shadcn default palette (WCAG AA in both themes).

## Known Limitations

- No production auth, real emails, or persistence beyond a single browser profile.
- Logo upload, full org tree hierarchy editor (parent/child drag & drop), and rich country/timezone pickers are simplified for the prototype.
- Only the Main Branch is modeled; multi-branch administration is deferred.
- Only the System Owner user is represented; there is no user list, no invitations, no approval queue.
- Deep-link protection between steps is not enforced strictly — the readiness checklist is the single source of truth for activation.
- The `_authenticated` gate is intentionally absent; the entire prototype is publicly reachable and safe because no real credentials or data exist.
