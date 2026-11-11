# System architecture

| Criterion | A · Extend existing script | B · Extract core beneath both UIs | C · Keep legacy and add V2 |
|---|---|---|---|
| Reuse and compatibility | Most DOM reuse, shared regressions likely | Highest lasting code reuse, requires migration | Reuse rules, fixtures and visual language, legacy remains runnable |
| Calculation safety and testing | Mixed Number, DOM and new exact types | Strong boundary after migration | Strict types and independent tests from first change |
| Initial effort/cost | Lowest for a second view, rising with adapter complexity | Highest migration and parity effort | Moderate new UI and build work |
| Maintenance | Coupled presentation and arithmetic | One maintained engine, two clients | Two entry points and duplicate legacy rules, frozen baseline limits drift |
| Performance and scale | Requires replacing month-oriented state | Both routes can benefit from reusable engine | Direct jumps and bounded viewport specific to V2 |
| Deployment | Existing static files | Atomic change to legacy assets needed | Static side-by-side deployment, V2 assets separately versioned |

**PROPOSED Option C.** Leave the legacy page reachable. Build strict TypeScript modules compiled to static assets, with a small DOM view and native BigInt. No application framework, backend, database or paid API is needed. Option B becomes attractive if future requirements demand active feature parity in both clients. Migrate only after the compatibility suite demonstrates equivalent legacy results. [existing project analysis](02-EXISTING-PROJECT-ANALYSIS.md) · [architecture decisions](15-ARCHITECTURE-DECISIONS.md)

| Proposed module | Owns | Dependencies |
|---|---|---|
| chronology | Absolute days, indices, intervals and floor arithmetic | Integer primitives |
| calendars | Field validation, epoch conversion and metadata, one implementation per convention | chronology day type, licensed local data |
| annotations | Anchor, legacy anniversary and positive thousandth milestones | Gregorian adapter and core |
| selection | Atomic selected D, zoom, input errors, request revision | Core and adapter registry |
| timeline | Visible ticks, common cursor, form, accessible details | Selection snapshot and presentation formatters |
| observance, later | Local instants of sunset associated with a Saturday | Location, IANA zone, historical zone data and solar algorithm |

Search dispatches one intent. A successful inverse yields D; the controller commits D once, computes the cycle, requests all representations and renders rows for the same revision. A delayed provider result cannot replace a newer selection. Failure before commit leaves the previous selection active. Local resources enable offline operation after assets are available. The legacy page can be served alongside the versioned V2 bundle without bundling its private script into V2.

**Observance extension.** Resolve the selected local Saturday and preceding local Friday in the requested zone. Compute each day's sunset independently for observer coordinates, with versioned event definition, elevation convention and zone rules. Use their instants for a half-open observance interval. DST and political offset changes preclude assuming a 24-hour elapsed duration. Mark uncertain historical zone reconstruction, missing local dates or absent polar sunsets explicitly. Any community-specific fallback requires a named policy. Keep the mathematical day and index available throughout.
