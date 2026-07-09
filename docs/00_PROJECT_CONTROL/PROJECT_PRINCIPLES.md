# PROJECT PRINCIPLES

**Status:** UNDER_DISCUSSION
**Version:** 0.1

These are non-negotiable design principles. Every decision, module, and
feature must comply.

---

## 1. Configuration-Driven

Business rules, workflows, approvals, and validations are configurable —
not hard-coded. Changing a rule should not require code changes.

## 2. Modular

The system is a set of independent modules with clear contracts.
Modules can evolve, be replaced, or be added without breaking others.

## 3. Auditable

Every create, update, delete, approve, and configuration change is logged
with who, what, when, before, after — permanently and immutably.

## 4. Traceable

Every item can be traced backwards (source, supplier, heat, lot, certificate)
and forwards (customer, sales order, delivery) at any time.

## 5. Revision-Controlled

Documents, quotations, product templates, and configurations have versions.
Nothing is silently overwritten.

## 6. Role-Based

Every action is permitted or denied based on role and context.
No user has more access than their role requires (least privilege).

## 7. ISO 9001 Compatible

Document control, approvals, corrective actions, and audit trails satisfy
ISO 9001:2015 requirements by design.

## 8. No Vendor Lock-in

- Code is owned by the business (GitHub).
- Database uses PostgreSQL (portable, open-source).
- Files use S3-compatible storage (portable across providers).
- Docs are open-format Markdown / JSON / CSV.
- The system must be movable to any developer, AI, or hosting provider.

## 9. AI Under Human Control

AI suggestions are never automatically approved. Every AI-generated value
carries its source (provenance) and requires human review before becoming
master data.

## 10. Explicit Over Implicit

No silent side effects. No setting silently changes another. No workflow
skips an approval without a documented, configured exception.

## 11. Separation of Concerns

- Product master data ≠ inventory data ≠ traceability data ≠ certificates.
- Technical Item identity ≠ Supplier / Heat / Lot / Location / Price.
- Draft ≠ Approved ≠ Published.

## 12. Fail Safe, Not Fail Silent

On error: block the action, log the reason, notify the responsible role.
Never continue with partial or corrupted data.

## 13. Portable Data Ownership

- Full database export possible at any time.
- All uploaded files retrievable independent of the application.
- Local development on any machine must be possible.

## 14. Documentation Before Implementation

No code is written before the corresponding requirement, rule, and
acceptance criteria exist in the documentation.
