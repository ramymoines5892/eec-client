
# EEC ERP – Foundation Sprint 01

هدف السبرنت: بناء الأساس الدائم للـ ERP (Administration + Master Data Framework) بدون أي منطق أعمال حقيقي (لا RFQ، لا Purchasing، لا Sales، لا Inventory).

الشغل ضخم جدًا لدرجة إن تنفيذه في رسالة واحدة مستحيل. الخطة تحت مقسّمة على **7 مراحل**. ننفّذ مرحلة، تراجعها، بعدين نكمل.

---

## المبادئ (تنطبق على كل مرحلة)

- No hard coding — كل شيء من Settings/DB.
- AR/EN + RTL/LTR (موجود بالفعل).
- Responsive: Desktop / Tablet / Mobile.
- شكل صناعي ERP (Sidebar + Data Tables + Panels).
- Reusable components فقط — أي شاشة CRUD جديدة = استخدام نفس Layout.
- Row-Level Security + جدول `user_roles` + دالة `has_role` (موجودين).
- Multi-tenant عبر `company_id` (شركة النظام) كمفتاح أساسي في كل جدول.
- لو قاعدة عمل غير معروفة → `TODO` مش تخمين.

---

## المراحل

### Phase 1 — Shell + Navigation + Reusable Layouts
- `AdminShell` (Sidebar بمجموعات: Organization / Business Partners / Master Data / Reference Data / Workflow / Numbering / Security / Languages / Templates / System).
- Header يحتوي: Language switch, User menu, Notifications placeholder.
- Reusable page primitives:
  - `MasterListPage` (Search bar + Filter panel + Actions + Data table + Pagination + Bulk actions).
  - `MasterDetailsPage` (Tabs: Details / History / Attachments / Revisions / Approvals / Comments).
  - `ConfirmationDialog`, `ArchiveDialog`.
- Routing structure تحت `/_authenticated/admin/*`.

### Phase 2 — Reference Data Framework (الأساس اللي كل حاجة تبني عليه)
جداول DB + شاشات CRUD:
- `reference_sources` (اسم المصدر: Countries, Currencies, UOM, Industries…)
- `reference_values` (قيم هرمية parent_id، multilingual name)
- `business_domains`, `categories`, `subcategories`
- `attributes` (Name, Code, DataType, ReferenceSource, Default, Validation, Required, Visible, ReadOnly, Searchable, Filterable, MultipleValues)
- `templates` (مجموعة attributes مربوطة بـ entity type)
Seed بيانات مرجعية أساسية: عملات، دول، وحدات قياس.

### Phase 3 — Master Data Lifecycle Engine
- Enum: `Draft → Review → Approved → Released → Inactive → Archived`.
- جدول `entity_revisions` + `entity_history` + `entity_attachments` + `entity_approvals` + `entity_comments` — جينيريك عبر `entity_type` + `entity_id`.
- Reusable panels: `HistoryPanel`, `ApprovalPanel`, `RevisionPanel`, `AttachmentPanel` (placeholder للتخزين), `CommentPanel`.
- Hook `useLifecycle(entityType, id)`.

### Phase 4 — Organization Module
CRUD كامل باستخدام Layouts الجاهزة:
- **Company** (بيانات الشركة الأم – الموجود بالفعل يتم دمجه)
- **Branch** (name إجباري، code اختياري، country/city/address/phone/email من reference_values)
- **Department** (هرمي — parent_id)
- **Job Title**
- **Employee** (مرتبط بـ profile اختياريًا)
- **Position Assignment** (Employee × Department × JobTitle × Branch × dates)
Organization chart كـ flowchart تفاعلي (React Flow).

### Phase 5 — Business Partners Module
- كيان موحد `business_partners` (اسم/كود/بيانات اتصال).
- جدول `business_partner_roles` (role enum: Customer, Vendor, Manufacturer, Agent, Carrier, InspectionCompany, Bank, Insurance) — نفس الكيان بأكثر من دور.
- CRUD + فلترة حسب الدور.

### Phase 6 — Cross-Cutting Config Modules
- **Numbering**: templates للأرقام التسلسلية (prefix, padding, reset frequency) — بدون استخدامها الآن.
- **Workflow**: تعريف steps + approvers لكل entity_type (بدون تفعيل).
- **Security**: إدارة الأدوار والصلاحيات (roles CRUD, permissions matrix).
- **Languages**: قائمة اللغات المفعلة + مفاتيح i18n.
- **Templates**: template registry (مربوط بالـ attributes من Phase 2).
- **System**: إعدادات عامة (locale, timezone, date format, fiscal year).

### Phase 7 — Polish & QA
- فحص RTL على كل الشاشات.
- Mobile breakpoints.
- Empty states + Loading states + Error boundaries على كل route.
- Security scan.

---

## Deliverables عند نهاية السبرنت
1. Admin Shell + Sidebar كامل.
2. مكتبة مكونات: `MasterListPage`, `MasterDetailsPage`, `SearchBar`, `FilterPanel`, `HistoryPanel`, `ApprovalPanel`, `RevisionPanel`, `AttachmentPanel`, `CommentPanel`, `ConfirmationDialog`, `ArchiveDialog`.
3. Reference Data Framework شغال.
4. Master Data lifecycle engine شغال.
5. Organization module CRUD كامل + org chart.
6. Business Partners module موحد بأدوار متعددة.
7. Numbering / Workflow / Security / Languages / Templates / System شاشات إعدادات (بدون منطق تشغيلي).
8. صفر hard-coding في business rules، صفر منطق RFQ/Sales/Inventory/Certificates.

---

## التفاصيل التقنية

- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn (كما هو).
- Backend: Lovable Cloud (Supabase) — جميع الجداول تحت `public` مع RLS + GRANT.
- Auth: النظام الحالي (Magic Link — ينشر لاحقًا).
- Routing: `src/routes/_authenticated/admin/*` + layout مخصص بـ Sidebar.
- State: TanStack Query + server functions (`*.functions.ts`).
- Forms: react-hook-form + zod (موجودين).
- Icons: lucide-react.
- Org chart / Workflow: `@xyflow/react` (React Flow).

---

## نقطة البدء المقترحة

**نبدأ بـ Phase 1** (Admin Shell + Reusable Layouts) — أساس بدونه مفيش شاشة تانية.

بعد ما أخلص Phase 1 هعرضهالك، وتقولي: نكمل Phase 2 ولا تعدّل حاجة في الشكل/الـ navigation؟

هل توافق على الخطة والترتيب؟ لو أيوة أبدأ Phase 1 فورًا.
