# DECISION LOG

Chronological record of all approved and proposed architectural decisions.

**Statuses:** PROPOSED | UNDER_DISCUSSION | APPROVED | DEPRECATED
**Format:** Each decision is an ADR (Architecture Decision Record).

---

## AD-001 — Multi-tenancy & Organizational Scope

**Status:** OPEN — awaiting business input
**Context:** Must know if the system serves one company, a group of legal
entities (multi-company), or external customers (SaaS) before designing
Party model, security scoping, and data isolation.
**Decision:** Pending.
**Consequences:** Blocks D1 (Party) and D2 (Product Master).

---

## AD-002 — Item Identity Definition

**Status:** OPEN
**Context:** Must define exactly which attributes make a Technical Item
unique, and which attributes (supplier, heat, lot, location, price) are
NOT part of identity.
**Decision:** Pending — will be resolved during Product Master discovery.
**Consequences:** Cornerstone of Product Master module (D2).

---

## AD-003 — Traceability Granularity Model

**Status:** OPEN
**Context:** Define the smallest tracked unit (Package? Layer? Piece?)
and its relation to Heat/Lot/Cast/Certificate.
**Decision:** Pending.
**Consequences:** Shapes Warehouse & Inventory (D9) and Quality (D10).

---

## AD-004 — Configuration Governance Model

**Status:** OPEN
**Context:** Who can edit configuration, what are Protected System Rules,
how does Draft → Validate → Approve → Publish → Version flow work, how
does Impact Analysis prevent silent breakage.
**Decision:** Pending.
**Consequences:** Foundation of Configuration Studio (X1).

---

## AD-005 — AI Knowledge Boundary

**Status:** OPEN
**Context:** What may AI suggest, what is forbidden, how is Provenance
tracked, and what is the Human-in-the-loop policy before approval.
**Decision:** Pending.
**Consequences:** Defines AI Controlled Knowledge module (D4).

---

## AD-006 — Hosting Strategy

**Status:** APPROVED (2026-07-09)
**Context:** Owner wants free/low-cost hosting during development,
scaling to managed cloud after launch. No data residency restriction.
**Decision:**
- **Development phase:** Lovable Cloud (Supabase Free tier) + Lovable preview.
- **Post-launch:** Managed cloud (Supabase Pro + Cloudflare/Vercel/Lovable
  hosting for the app).
- **Not chosen:** On-premise with router port forwarding — rejected due
  to uptime, security, backup, and ISO 9001 compliance risks.
**Consequences:** Fits budget; requires internet connectivity; portable
because all layers are open-source under the hood.

---

## AD-007 — File Storage Strategy

**Status:** APPROVED (2026-07-09)
**Context:** Owner initially proposed storing uploaded files on the same
server as the app. Files average 25 MB (PDF, Word, Excel, images).
**Decision:** Files stored in **Object Storage separate from the app
server**. Preferred provider: **Cloudflare R2** (10 GB free, no egress
fees, S3-compatible). Alternative for dev: Supabase Storage.
**Rejected:** Local filesystem on app server — causes backup, scaling,
performance, and portability problems.
**Consequences:** Files survive server changes; CDN delivery is fast;
migration to any S3-compatible provider is trivial.

---

## AD-008 — File Upload Architecture

**Status:** APPROVED (2026-07-09)
**Context:** Uploading 25 MB files through the app server is slow and
wastes server resources.
**Decision:** **Direct-to-Storage uploads via Signed URLs.** The app
server issues a short-lived signed URL; the browser uploads directly to
the storage bucket.
**Consequences:** App server is not in the upload path — near-unlimited
upload throughput and low server load.

---

## AD-009 — File Optimization Strategy

**Status:** APPROVED (2026-07-09)
**Context:** 25 MB average file size can slow down user interfaces if
served raw every time.
**Decision:** Apply:
- Image compression (WebP where applicable)
- Thumbnail generation for images
- PDF preview generation
- Lazy loading of file lists
- Server-side virus scan on upload (ISO 9001 requirement)
**Consequences:** Snappy UI regardless of underlying file size.

---

## AD-010 — Backup & Disaster Recovery Strategy

**Status:** APPROVED (2026-07-09) — principle only, RPO/RTO targets pending
**Context:** ISO 9001 requires reliable backup and recovery.
**Decision:**
- Daily database snapshots (managed by cloud provider).
- File storage versioning enabled on the bucket.
- Weekly off-site export retained locally by the business.
- Formal RPO/RTO targets to be defined before go-live.
**Consequences:** Business survives cloud provider incidents.

---

## AD-011 — Code Ownership & Repository Strategy

**Status:** APPROVED (2026-07-09)
**Context:** Owner requires full code ownership and the ability to
download and self-host the project at any time.
**Decision:** Project synced to GitHub repository
`ramymoines5892/eec-client` from Day 1. Bidirectional sync with Lovable.
Owner can `git clone` at any time.
**Consequences:** No dependency on Lovable for code access; every change
(including documentation) versioned in Git.

---

## AD-012 — Database Portability

**Status:** APPROVED (2026-07-09)
**Context:** Owner wants to run a local copy of the database on his own
machine, understanding the local data will differ from cloud data.
**Decision:**
- **PostgreSQL** is the standard database in both cloud and local.
- All schema changes stored as **SQL migration files** in the repository.
- `supabase db reset` rebuilds the full schema locally from migrations.
- Structure is portable; production data stays in cloud.
**Consequences:** Any developer can spin up a working local copy in
minutes from Git alone.

---

## AD-013 — Environment Separation

**Status:** APPROVED (2026-07-09) — principle only
**Context:** Different environments (local dev, staging, production) need
independent data and secrets.
**Decision:** Environments separated by environment variables (.env
files, never committed). Same code, same schema, different data and
credentials.
**Consequences:** Safe experimentation locally; no risk to production data.

---

## AD-014 — Data Export & Backup Strategy

**Status:** APPROVED (2026-07-09)
**Context:** Owner must be able to take a copy of live data at any time.
**Decision:**
- Supabase Data Export used for full database dumps (SQL/CSV).
- File storage supports full download.
- Business is responsible for local retention of exported copies.
**Consequences:** Business retains a full independent copy of its data
independent of any vendor.

---

## AD-015 — Anti Vendor Lock-in Guarantee

**Status:** APPROVED (2026-07-09) — master principle
**Context:** Owner explicitly requires that the entire system be
transferable to any other AI, developer, or software company.
**Decision:** Every technology chosen must satisfy:
1. Open-source or open-standard core (PostgreSQL, S3 API, Markdown, Git).
2. No proprietary data formats.
3. Full export/download of code, schema, data, and files always available.
4. Documented migration path away from the current hosting provider.
**Consequences:** Occasionally rules out convenient proprietary options;
protects the business long-term.

---

## Pending Decisions (Not Yet Discussed)

- AD-016 — Authentication provider & MFA policy
- AD-017 — Numbering series strategy (PO, RFQ, Quotation, Invoice)
- AD-018 — Multi-language & multi-currency requirements
- AD-019 — Tax / VAT engine scope
- AD-020 — Incoterms & Trade Compliance scope
