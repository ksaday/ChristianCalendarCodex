# Requirements traceability

Each row maps a normative SRS entry to its controlling decision, implementation specification, verification case and promotion gate. Refer to [software requirements srs](03-SOFTWARE-REQUIREMENTS-SRS.md) for priorities and dependencies, [architecture decisions](15-ARCHITECTURE-DECISIONS.md) for the decision rationale and [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md) for expected outcomes.

| Requirement | Decision | Design | Verification | Gate |
|---|---|---|---|---|
| REQ-CHR-001 | ADR-01 | [mathematical foundation](04-MATHEMATICAL-FOUNDATION.md) | T01 | G1 |
| REQ-CHR-002 | ADR-01 | [negative sabbath numbering](05-NEGATIVE-SABBATH-NUMBERING.md) | T02 | G1 |
| REQ-CHR-003 | ADR-02 | [chronology core design](06-CHRONOLOGY-CORE-DESIGN.md) | T03 | G1 |
| REQ-CAL-001 | ADR-03 | [calendar conversion design](07-CALENDAR-CONVERSION-DESIGN.md) | T04 | G2 |
| REQ-CAL-002 | ADR-03 | [calendar conversion design](07-CALENDAR-CONVERSION-DESIGN.md) | T05 | G2 |
| REQ-CAL-003 | ADR-03 | [calendar conversion design](07-CALENDAR-CONVERSION-DESIGN.md) | T06 | G2 |
| REQ-CAL-004 | ADR-03 | [data models and interfaces](10-DATA-MODELS-AND-INTERFACES.md) | T07 | G2 |
| REQ-UI-001 | ADR-04 | [ui ux design](11-UI-UX-DESIGN.md) | T08 | G3 |
| REQ-UI-002 | ADR-04 | [ui ux design](11-UI-UX-DESIGN.md) | T09 | G3 |
| REQ-PERF-001 | ADR-04 | [ui ux design](11-UI-UX-DESIGN.md) | T10 | G3 |
| REQ-SEC-001 | ADR-02 | [data models and interfaces](10-DATA-MODELS-AND-INTERFACES.md) | T11 | G1 precision / G3 shell |
| REQ-LEG-001 | ADR-05 | [existing project analysis](02-EXISTING-PROJECT-ANALYSIS.md) | T12 | G3 |
| REQ-RES-001 | ADR-06 | [genesis creation research](08-GENESIS-CREATION-RESEARCH.md) | T13 | G3 default / G4 overlay |
| REQ-OBS-001 | ADR-06 | [system architecture](09-SYSTEM-ARCHITECTURE.md) | T14 | G4 |
| REQ-OPS-001 | ADR-05 | [system architecture](09-SYSTEM-ARCHITECTURE.md) | T15 | G3 |

**Coverage audit.** T01–T03 cover the integer lattice, T04–T07 the representations, T08–T11 the interactive and transport boundaries, and T12 the repository baseline. T13 and T14 address the two independent optional interpretations. T15 verifies static delivery. The separate release columns prevent a future extension from being mistaken for an MVP prerequisite.

A release evidence record should link each test result to the relevant row, exact revision and verified coverage. Any proposed change to the anchor, removal of zero, or use of local time to assign an index conflicts with the baseline requirements and cannot pass through an adapter or UI change.
