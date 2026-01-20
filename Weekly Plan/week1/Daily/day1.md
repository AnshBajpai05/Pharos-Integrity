# Day 1 — Claim Ontology & AAMLT Schema

## Objective

Freeze a regulator-defensible, machine-readable definition of what constitutes an auditable ESG claim in the Pharos-Integrity system. This schema serves as the canonical contract between document intelligence, claim extraction, contradiction modeling, verifiability estimation, and downstream evidence grounding.

---

## Scope of Work

### 1. Core Claim Representation (AAMLT)

Each claim is represented using the following structured tuple:

* **Subject** – Entity making or affected by the claim
* **Aspect** – ESG dimension and sub-category (E/S/G taxonomy)
* **Action** – Reported activity or change
* **Metric** – Quantitative or qualitative measurement
* **Location** – Spatial reference with geocoding hooks
* **Time** – Temporal scope and specificity

This enables uniform treatment of:

* Text-only narrative claims
* Facility-level operational claims
* Time-series environmental metrics
* Corporate-wide policy statements

---

### 2. Claim Meta-Attributes

Additional fields required for verifiability and audit logic:

| Field                | Purpose                                   |
| -------------------- | ----------------------------------------- |
| quantified           | Whether numeric measurement exists        |
| temporal_specificity | exact / range / vague                     |
| spatial_specificity  | facility / region / country / vague       |
| groundable           | Whether physical verification is possible |
| modality_candidate   | optical / SAR / both / none               |
| uncertainty_class    | low / medium / high                       |

---

### 3. Contradiction Modeling

Typed contradiction categories for graph-based reasoning:

* temporal
* scope
* metric
* hard (logical negation)

Each claim supports severity scoring and cross-claim linking.

---

### 4. Provenance & Auditability

Every claim retains:

* OCR confidence
* Layout block ID
* Paragraph ID
* Extraction model signature
* Human review flags

This ensures:

* Sentence-level traceability
* Regulatory defensibility
* Explainable error propagation

---

## Deliverable

**File:** `claim_schema.json`
**Status:** Frozen
**Validation Criteria Met:**

The schema can represent:

* Narrative ESG statements
* Quantified environmental metrics
* Multi-facility operational disclosures
* Temporal trend claims
* Ambiguous or weakly specified sustainability assertions
* Claims eligible and ineligible for satellite verification

---

## Why This Matters

This schema is the backbone of the entire Pharos-Integrity system:

* Controls what the CVE model can reason about
* Governs which claims enter satellite grounding
* Enables contradiction graphs
* Provides the audit trail foundation
* Prevents over-claiming of “verification”

Without this freeze, downstream models cannot be calibrated or regulator-aligned.

---

## Next Step

**Day 2 — Claim Verifiability Estimator (CVE) Specification**

Define:

* Feature space
* Modality feasibility logic
* Thresholds for evidence invocation
* Calibration targets

---
