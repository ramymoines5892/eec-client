# PROTOTYPE_01_REQUIREMENTS

Traceability matrix for every approved Prototype 01 requirement.

**Legend — Implementation Status:** ✅ Implemented · ⚠️ Simulated · ➖ Deferred (out of scope)
**Legend — Validation Method:** Manual = manual browser walkthrough of the mapped route.

## A. Public & Auth Experience

| ID | Requirement | Screen / Component | Status | Validation | Notes |
|---|---|---|---|---|---|
| A1 | Language Selection screen | `/language` (`src/routes/language.tsx`) | ✅ | Manual | Persists choice to store; updates `<html dir/lang>`. |
| A2 | Setup Landing screen | `/setup-landing` (`src/routes/setup-landing.tsx`) | ✅ | Manual | Entry points to setup or sign-in. |
| A3 | System Owner Email Entry | `/auth/email` (`src/routes/auth.email.tsx`) | ✅ | Manual | Stores email; sets `userIdentity = REGISTERED`. |
| A4 | Email Verification Sent | `/auth/verify-sent` (`src/routes/auth.verify-sent.tsx`) | ⚠️ | Manual | No email sent; explicit "simulated" copy. |
| A5 | Email Verification Result | `/auth/verify-result` (`src/routes/auth.verify-result.tsx`) | ⚠️ | Manual | Sets `emailVerification = VERIFIED`. |
| A6 | Create Password | `/auth/create-password` (`src/routes/auth.create-password.tsx`) | ⚠️ | Manual | Client-only; sets `credential = SET`, `workspace = IN_SETUP`. Not stored anywhere. |
| A7 | Login | `/auth/login` (`src/routes/auth.login.tsx`) | ⚠️ | Manual | Accepts any values; routes to dashboard if workspace ACTIVE else wizard. |
| A8 | Forgot Password | `/auth/forgot` (`src/routes/auth.forgot.tsx`) | ⚠️ | Manual | Simulated. |
| A9 | Reset Password | `/auth/reset` (`src/routes/auth.reset.tsx`) | ⚠️ | Manual | Simulated. |

## B. Initial Company Setup

| ID | Requirement | Screen / Component | Status | Validation | Notes |
|---|---|---|---|---|---|
| B1 | Setup Welcome & Progress | `/wizard` (`src/routes/wizard.index.tsx`) + `WizardLayout` | ✅ | Manual | Sidebar shows all steps; progress derived from readiness checklist. |
| B2 | Company Details (Legal Name, Display Name, Country, Timezone, Functional Currency required) | `/wizard/company` | ✅ | Manual | Required vs optional labeled explicitly. |
| B2a | Company Code auto-generated, editable, unique-in-workspace | `/wizard/company` | ✅ | Manual | Uniqueness not enforced across a real workspace — prototype only. |
| B2b | Optional Logo, Tax Reg, Commercial Reg | `/wizard/company` | ⚠️ | Manual | Logo upload simplified (text field placeholder omitted for now; documented limitation). |
| B3 | Main Branch (Name, Code, Main indicator, Country, City required) | `/wizard/branch` | ✅ | Manual | Warehouse is NOT modeled as a Branch. |
| B3a | Branch Code auto-generated, editable | `/wizard/branch` | ✅ | Manual | |
| B4 | Financial Basics — functional shown, transaction currencies selectable (EGP/EUR/USD/GBP defaults) | `/wizard/financial` | ✅ | Manual | Exchange rate engine intentionally excluded. |
| B5 | Suggested Organization Structure — adopt / rename / remove / add / skip | `/wizard/org` | ✅ | Manual | Parent-child hierarchy editor deferred (documented limitation). |
| B6 | System Owner Employee Profile (Full Name, Employee Code, Primary Branch, Org Unit, Job Title, Start Date) | `/wizard/employee` | ✅ | Manual | Primary Branch auto-defaults to Main Branch. |
| B6a | Safe defaults when org setup skipped (General Management / System Owner) | `/wizard/org` + `/wizard/employee` | ✅ | Manual | Applied when skipping the org step. |
| B7 | System Owner Position Assignment | `/wizard/position` | ✅ | Manual | Sets `employee = ACTIVE`. |
| B8 | Setup Review with per-section Edit | `/wizard/review` | ✅ | Manual | |
| B9 | Activation Readiness Checklist with per-item Complete Now, gated Activate button | `/wizard/checklist` | ✅ | Manual | Activation disabled until all items are ✓. |
| B10 | Activation Success | `/wizard/success` | ✅ | Manual | Sets `workspace = ACTIVE`, `access = ACTIVE`. |

## C. Application Shell

| ID | Requirement | Screen / Component | Status | Validation | Notes |
|---|---|---|---|---|---|
| C1 | Responsive application layout | `AppShell` (`src/prototype/components/AppShell.tsx`) | ✅ | Manual (resize) | Sidebar collapses above content on mobile. |
| C2 | Empty dashboard | `/app/dashboard` | ✅ | Manual | |
| C3 | Company name in shell | `AppShell` header | ✅ | Manual | |
| C4 | Current branch in shell | `AppShell` header | ✅ | Manual | |
| C5 | User menu | `AppShell` header (Reset acts as user-menu placeholder) | ⚠️ | Manual | Full user menu (profile / sign-out / MFA) deferred. |
| C6 | Language switcher in shell | `AppShell` header | ✅ | Manual | |
| C7 | Placeholder navigation showing future modules as unavailable / "Coming Later" | `AppShell` nav | ✅ | Manual | RFQ, Products, Procurement, Inventory, Sales, Quality, Finance all shown as `Coming Later`. |

## D. Cross-Cutting

| ID | Requirement | Component | Status | Validation | Notes |
|---|---|---|---|---|---|
| D1 | Arabic and English | `src/prototype/i18n.ts` | ✅ | Manual | All strings translated. |
| D2 | Correct RTL and LTR | `useApplyDirection` in i18n | ✅ | Manual | `<html dir>` toggled at runtime. |
| D3 | Responsive across desktop, laptop, tablet, mobile | All layouts | ✅ | Manual (resize / DevTools) | Mobile-first Tailwind breakpoints. |
| D4 | Modern professional enterprise design | shadcn/ui + design tokens | ✅ | Visual | No purple gradients, no marketing aesthetics. |
| D5 | Accessibility | Labels / semantic HTML / focus rings | ✅ | Manual | See README §Accessibility. |
| D6 | No production database, Supabase integration, backend API, real auth, SQL, or migrations | Entire prototype | ✅ | File audit | No prototype file imports from `src/integrations/supabase/*`. |
| D7 | Independent state dimensions preserved (not collapsed) | `src/prototype/store.ts` (`StateModel`) | ✅ | Code review | Eight independent fields; UI derives friendly labels. |
| D8 | Prototype clearly labeled as prototype | `PrototypeBanner` on every shell | ✅ | Visual | Amber banner on top of every screen. |

## Deferred / Out of Scope (explicitly excluded from Prototype 01)

Full Employee, User, Invitation, Roles, Permission, Approval Queue, Rejected Account, Security Policy, Audit Log, Branch Admin, Org Editor, MFA, Currency Exchange, RFQ, Products, Inventory, Procurement, Sales, Finance, Quality, Logistics, Certificates.
