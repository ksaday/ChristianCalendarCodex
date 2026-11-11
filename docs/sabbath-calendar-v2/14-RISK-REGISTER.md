# Risk register

Likelihood and impact are qualitative planning estimates. Gate names refer to [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md). A release owner records disposition and evidence for unresolved risks before signing the corresponding gate.

| Risk / exposure | L / I | Detection | Mitigation, responsibility and release consequence |
|---|---|---|---|
| Truncation at negative displacement assigns Friday to wrong week | High / high | T02, especially A−1 | Core maintainer owns Euclidean division; block G1. |
| Number coercion collapses adjacent distant indices | High / high | T03, T10, T11, distant one-day step | Core and UI maintainers inspect each numeric narrowing; allow only bounded coordinates/provider fields. Block G1/G3. |
| Half-day or cutover mismatch shifts every ancient label | Medium / high | T04 and two labels for anchor | Adapter maintainer documents day convention and chosen calendar for each fixture. Block G2. |
| Shared almanac lineage creates false confidence | Medium / high | Source audit finds identical algorithm or input tables | Verification owner obtains differently derived evidence and records residual dependence. Block unsupported coverage claim. |
| Leap-month identity lost in reverse search | High / high | T05/T06 near consecutive same-number months | Adapter owner retains stable month codes and leap flag; return field error on ambiguity. Block G2. |
| HKO redistribution rights or endpoint data insufficient | Medium / high | Dataset and licensing review, partial-year check | Release owner secures terms, changes provider or explicitly reduces proposed range with approval; never extrapolate. |
| Historical projection mistaken for observation | Medium / high | Inspect ancient search and uncertain date details | Research editor labels convention, provenance and calendar limits. Block misleading copy at G3. |
| Extremely long input freezes tab | Medium / medium | T11 at input and import limits | UI owner bounds bytes/digits before conversion. Rejected input leaves selection intact. |
| Legacy parity drifts as two routes evolve | Medium / medium | T12 and source checksum | Keep legacy frozen, document explicit future migration decision. Block G3 on fixture divergence. |
| Solar event missing or historical offset conjectural | High / medium | Polar and zone-rule fixtures | Observance owner reports unavailable or uncertain and preserves chronology. Block unqualified display at G4. |
| Rendered labels overlap or only color signals unsupported rows | Medium / high | T09/T10 at 320px and coarse zoom | UI owner thins ticks, uses selected-day text list, status words and predictable focus. Block G3. |

Residual theological uncertainty cannot be eliminated by increasing numerical precision. The research editor maintains a record of interpretation and approval for each optional model. [genesis creation research](08-GENESIS-CREATION-RESEARCH.md)
