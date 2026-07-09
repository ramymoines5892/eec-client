# GLOSSARY

**Status:** LIVING DOCUMENT
**Rule:** Every technical or business term used anywhere in the project
MUST be defined here before use.

---

## A

- **ADR (Architecture Decision Record):** A dated, numbered document
  capturing one architectural decision, its context, alternatives,
  consequences, and status.
- **Approved Vendor List (AVL):** Suppliers that have passed qualification
  and are approved to receive Purchase Orders.
- **Attribute:** A named property of a product (e.g., Material Grade,
  Diameter, Wall Thickness).
- **Audit Trail:** Immutable log of every state-changing action in the
  system.

## C

- **Cast Number:** Identifier assigned by a foundry/mill to a specific
  cast of metal; may equal Heat Number depending on standard.
- **Certificate:** Document (typically PDF) proving compliance of a
  material or product with a standard (e.g., EN 10204 3.1, 3.2).
- **Configuration Studio:** Internal admin surface for managing all
  configurable settings (rules, workflows, templates, approvals).

## D

- **Domain Object:** A named business concept (e.g., Customer, RFQ,
  Purchase Order) with attributes, rules, and lifecycle.

## H

- **Heat Number / Heat Code:** Identifier for a specific batch of metal
  produced in one heating cycle at a mill.

## I

- **Inventory Package:** A physically distinct unit stored in a warehouse
  location, traceable to a Heat/Lot and Certificate.
- **ISO 9001:** International standard for Quality Management Systems.
- **Item Identity:** The minimal set of attributes that uniquely defines
  a Technical Item. Does NOT include supplier, price, heat, lot, or location.

## L

- **Lot Number:** Batch identifier for materials, not always equal to
  Heat Number depending on product type.

## M

- **Master Data:** Reference entities with long lifecycles (Products,
  Customers, Suppliers, Standards).

## N

- **Nonconformity (NCR):** Recorded deviation from a specification,
  standard, or procedure.

## P

- **Party:** Any legal entity the system deals with (Customer, Supplier,
  Branch, Contact).
- **PO (Purchase Order):** Formal order placed on a supplier.
- **Provenance:** The recorded source of any data value, especially
  AI-suggested values (which AI, which prompt, when, reviewed by whom).

## R

- **RFQ (Request For Quotation):** A customer or supplier inquiry
  requesting a price for specific items and quantities.
- **RLS (Row Level Security):** PostgreSQL feature restricting which rows
  a user can read or modify.

## S

- **SoD (Segregation of Duties):** Security principle preventing one
  person from controlling all steps of a sensitive process.

## T

- **Technical Item:** An abstract product definition (template + identity
  attributes) — NOT a specific physical stock unit.
- **Traceability:** The ability to follow a physical item forward
  (to customer) and backward (to supplier/heat/certificate).

## W

- **Work Package:** A unit of RFQ work assigned to a technical reviewer
  for assessment.
