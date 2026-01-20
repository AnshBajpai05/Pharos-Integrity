## WEEK 1 — Ontology, CVE, Orchestration Freeze

**Goal:** Lock all semantics, schemas, and control flow before touching heavy models.

---

### **Day 1 — Claim Ontology & AAMLT Schema**

**Objective:** Freeze what a “claim” means in your system.

**Tasks**

* Define AAMLT core fields:

  * Subject
  * Aspect
  * Action
  * Metric
  * Location
  * Time
* Define meta-fields:

  * quantified (bool)
  * temporal_specificity (exact / range / vague)
  * spatial_specificity (facility / region / country)
  * groundable (bool)
  * modality_candidate (optical / SAR / none)
  * uncertainty_class (low / medium / high)
* Define contradiction types:

  * temporal, scope, metric, hard

**Deliverable**

* `claim_schema.json`

**Done When**

* Schema can represent:

  * Text-only claims
  * Location-grounded claims
  * Time-series claims
  * Multi-facility claims
  * Vague ESG narrative claims

---

### **Day 2 — Claim Verifiability Estimator (CVE) Specification**

**Objective:** Define what “verifiable” means mathematically.

**Tasks**

* Define CVE target:

  * P(observable | public data, modality)
* Define features:

  * E5-large sentence embedding
  * Location specificity score
  * Temporal resolution score
  * Aspect category
  * Metric type
* Define outputs:

  * P_optical, P_SAR, P_none
* Define thresholds:

  * τ_optical, τ_SAR, τ_skip

**Models / Tech**

* XGBoost (tabular fusion)
* E5-large embeddings

**Deliverable**

* `cve_spec.md`
* Feature list + label definition

**Done When**

* Every claim can be classified into:

  * Optical-verifiable
  * SAR-verifiable
  * Non-groundable

---

### **Day 3 — Integrity Gap Formula Design**

**Objective:** Lock the math before coding.

**Tasks**

* Define components:

  * Text–vision embedding distance (DINOv2)
  * NDVI delta significance
  * SAR backscatter delta
  * Temporal alignment penalty
  * Contradiction severity
  * CVE confidence
* Define fusion:

  * Linear weighted sum
  * Bayesian uncertainty propagation
* Define output:

  * IntegrityGap ∈ [0,1]
  * σ_uncertainty

**Deliverable**

* `integrity_formula.md`

**Done When**

* Every signal has:

  * Weight
  * Confidence
  * Failure handling rule

---

### **Day 4 — LangGraph State Machine Design**

**Objective:** Freeze control logic.

**Tasks**

* Define states:

  * INGEST → LAYOUT → CLAIM → CVE → GATE → GEO → SAT → VISION → FUSION → EXPLAIN → HITL → STORE
* Define transitions & guards:

  * CVE threshold logic
  * Cloud fallback logic
  * Escalation logic
* Draw full DAG

**Models Referenced**

* LayoutLMv3
* DeBERTa
* RoBERTa-NLI
* CVE XGBoost
* DINOv2

**Deliverable**

* `workflow_dag.png`
* `langgraph_state_spec.yaml`

**Done When**

* Every UI page corresponds to a state output

---

### **Day 5 — API Contracts for UI Binding**

**Objective:** Ensure UI never breaks later.

**Tasks**

* Define endpoints:

  * `/claims/extract`
  * `/claims/{id}/cve`
  * `/claims/{id}/evidence`
  * `/claims/{id}/integrity`
  * `/audit/export`
* Define request/response schemas
* Define websocket events for progress

**Deliverable**

* `openapi.yaml`

**Done When**

* Your existing UI can:

  * Load claims
  * Click → map → evidence → score

---

### **Day 6 — Mock Pipeline Integration**

**Objective:** Prove end-to-end flow before real models.

**Tasks**

* Build mock services:

  * Fake LayoutLM output
  * Fake CVE scores
  * Fake NDVI curves
* Wire through LangGraph
* Call from UI

**Tech**

* FastAPI
* Pydantic
* LangGraph
* Mock NDVI arrays

**Deliverable**

* `week1_mock_pipeline.ipynb`
* `mock_backend.py`

**Done When**

* Clicking a sentence shows:

  * CVE
  * Evidence placeholder
  * Integrity score

---

### **Day 7 — Freeze & Review (Architecture Lock)**

**Objective:** No more schema changes after this.

**Tasks**

* Final review:

  * Claim schema
  * CVE spec
  * Integrity formula
  * DAG
  * APIs
* Version all artifacts
* Tag repository: `v1.0-architecture-freeze`

**Deliverables**

* All specs committed
* Architecture PDF export
* UI demo recording

**Done When**

* You can say:

  > “All semantics and control flow are frozen. Only model quality improves from now on.”

---

### Summary Table

| Day | Focus             | Output               |
| --- | ----------------- | -------------------- |
| 1   | Claim Ontology    | claim_schema.json    |
| 2   | CVE Definition    | cve_spec.md          |
| 3   | Integrity Math    | integrity_formula.md |
| 4   | Orchestration     | workflow_dag.png     |
| 5   | API Freeze        | openapi.yaml         |
| 6   | Mock Integration  | End-to-end stub      |
| 7   | Architecture Lock | v1.0 Freeze          |

---

This is exactly how high-risk AI audit platforms are built:
**semantics → control → contracts → models** (not the other way around).

When you finish Week 1, your project becomes impossible to derail.
