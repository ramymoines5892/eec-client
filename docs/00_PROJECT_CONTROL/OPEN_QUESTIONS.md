# OPEN QUESTIONS

Every unresolved business or architecture question is logged here until
answered or converted to a decision in `DECISION_LOG.md`.

**Format:**
`Q-NNN` | Area | Question | Blocks | Priority | Status

**Priorities:** P0 (blocks foundation) | P1 (blocks module) | P2 (nice to know)
**Statuses:** OPEN | ANSWERED | CONVERTED_TO_DECISION | DROPPED

---

## Foundation Questions (P0)

### Q-001 — Organizational Scope
**Area:** AD-001
**Question:** Is the system for one company with one/many branches, a group
of legally independent companies (multi-legal-entity with separate books
and currencies), or a future SaaS serving external customers?
**Blocks:** D1 (Party), D12 (Finance), Security scoping, Numbering series
**Priority:** P0
**Status:** OPEN — **this is the next question to answer**

### Q-002 — Business Location & Currency
**Area:** Finance, Compliance
**Question:** In which country/countries does the company operate? What is
the base currency? Are there multi-currency transactions with customers or
suppliers?
**Blocks:** D12 (Finance), Tax/VAT, Incoterms
**Priority:** P0
**Status:** OPEN

### Q-003 — Company Size & User Count
**Area:** NFR, Security
**Question:** How many employees will use the system? How many
concurrent users? How many departments?
**Blocks:** NFR (performance), Role model
**Priority:** P0
**Status:** OPEN

### Q-004 — Languages Required
**Area:** UI/UX, Data
**Question:** What languages must the UI and stored data support?
(Arabic + English? Others?) Right-to-left support?
**Blocks:** UI framework choice, data model
**Priority:** P0
**Status:** OPEN

---

## Product Master Questions (P1)

### Q-010 — Product Categories in Scope
**Area:** D2 (Product Master), D4 (AI Knowledge)
**Question:** Which product categories does the company currently trade?
(Piping, valves, fittings, flanges, gaskets, fasteners, instrumentation,
electrical, chemicals, PPE, spare parts, other?) Which is the highest
volume?
**Blocks:** Product Template design, initial pilot module
**Priority:** P1
**Status:** OPEN

### Q-011 — Standards & Certifications
**Area:** D2, D10
**Question:** Which material and dimensional standards are most used?
(ASTM, ASME, API, EN, DIN, ISO, JIS, other?)
**Blocks:** Reference Data module, Certificate types
**Priority:** P1
**Status:** OPEN

---

## Traceability Questions (P1)

### Q-020 — Heat/Lot Requirement Scope
**Area:** AD-003, D9, D10
**Question:** Which product categories require Heat/Lot traceability?
Which do not? Are there customer contracts that mandate 3.1 or 3.2
certificates?
**Blocks:** Warehouse & Inventory, Certificate management
**Priority:** P1
**Status:** OPEN

---

## Answered Questions

*(none yet)*
