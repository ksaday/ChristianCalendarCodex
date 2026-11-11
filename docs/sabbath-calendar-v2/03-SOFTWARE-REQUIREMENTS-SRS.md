# Software requirements specification

**PROPOSED baseline.** “Must” is release-blocking. “Later” reserves an interface and gates that feature when enabled. Mode A independence in RES-001 is mandatory in MVP. All test IDs refer to the detailed procedure in [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md). Dependencies below use the suffix of the stable requirement ID.

| ID | Requirement | Rationale | Priority | Depends on | Acceptance criterion | Verification |
|---|---|---|---|---|---|---|
| REQ-CHR-001 | Preserve anchor and every signed index | Stable numbering across zero | Must | — | S(1)=1733205 and adjacent anchors differ by 7 for every generated n | T01 |
| REQ-CHR-002 | Resolve exact day, cycle and four neighbor conventions | Week searches also accept weekdays | Must | CHR-001 | All seven offsets partition every tested week exactly once | T02 |
| REQ-CHR-003 | Compute direct jumps with arbitrary precision | Distant weeks exceed Number precision | Must | CHR-001 | Distinct adjacent integer inputs beyond 2^53 remain distinct across two runtimes | T03 |
| REQ-CAL-001 | Convert both proleptic civil calendars in both directions | Anchor and historical labels share a coordinate | Must | CHR-003 | Complete leap cycles round-trip, BCE/CE and reform fixtures pass | T04 |
| REQ-CAL-002 | Provide fixed Hebrew daytime labels and reverse search | Compare the calculated lunisolar year | Must | CAL-001 | Full declared window round-trips, leap Adars remain distinct | T05 |
| REQ-CAL-003 | Provide HKO Chinese labels and reverse search | Repeated month numbers require leap identity | Must | CAL-001 | Daily labels match pinned source, including leap and partial months | T06 |
| REQ-CAL-004 | Expose coverage, convention, uncertainty and provider errors | Row failures must preserve exact chronology | Must | CAL-001 | Both range edges and injected failures retain D and healthy rows | T07 |
| REQ-UI-001 | Search signed serials and validated calendar dates | Move to an arbitrary position in one action | Must | CHR-002, CAL-004 | All example journeys produce the specified selection; invalid input preserves it | T08 |
| REQ-UI-002 | Synchronize keyboard-accessible rows and zoom | Readers need one position at every scale | Must | UI-001 | Day through century navigation and desktop/mobile/screen-reader flows pass | T09 |
| REQ-PERF-001 | Bound tick count, coordinates and memory by viewport | Jump distance must not determine rendering cost | Must | CHR-003, UI-001 | DOM and cache stay within declared budgets under alternating distant jumps | T10 |
| REQ-SEC-001 | Validate transport, input budgets and output encoding | Retain exact values and keep input responsive | Must | CHR-003 | Malformed, excessive and markup inputs rejected; canonical decimal round-trips | T11 |
| REQ-LEG-001 | Preserve legacy route and regression values | Existing users depend on the grid and anniversary rule | Must | CHR-001, CAL-001 | Reference fixtures and legacy interaction checks pass | T12 |
| REQ-RES-001 | Keep interpretation optional and evidence-bearing | Creation models cannot establish the mathematical origin | Must / overlay later | CHR-001 | Default has no boundary; proposed model tests preserve canonical indices | T13 |
| REQ-OBS-001 | Resolve local sunset as a separate optional layer | Location can change observance times | Later | CHR-002 | Core outputs invariant under zone change; missing events carry status | T14 |
| REQ-OPS-001 | Serve both routes from static assets | Offline operation and low operating cost | Must | LEG-001 | Run complete MVP searches with remote requests blocked | T15 |

All signed quantities entering the core are integers. A successful search commits a coherent selection even if one or more converters return unsupported. Invalid reverse search leaves the selection intact. A calendar’s coverage is tested in both directions. Provider coverage is a versioned release claim. The shell can reject oversized input before parsing, with an explicit error that distinguishes this condition from an out-of-range calendar date.

The roadmap makes release ownership explicit. The trace matrix maps each requirement to a decision, specification and release gate. [development roadmap](13-DEVELOPMENT-ROADMAP.md) · [requirements traceability](17-REQUIREMENTS-TRACEABILITY.md)
