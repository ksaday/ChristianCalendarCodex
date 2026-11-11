# Chronology core design

**PROPOSED public contract.** An immutable, synchronous module accepts branded integers. AbsoluteDay, DayDelta and SabbathIndex have independent types. Construction from transport occurs once at the boundary. Within the core, every operand, literal in arithmetic, and intermediate has arbitrary integer precision.

| Operation | Contract |
|---|---|
| dayOf(index) | S(index), exact for each representable input. |
| cycleOf(day) | Return index, start, exclusiveEnd and offset as defined in [mathematical foundation](04-MATHEMATICAL-FOUNDATION.md). |
| exactIndex(day) | Tagged exact index at offset 0, otherwise offSabbath carrying cycle and offset. |
| previousStrict / nextStrict | Return absolute day of neighboring Sabbath on the indicated side. |
| onOrBefore / onOrAfter | Inclusive counterparts, both equal input on an exact Sabbath. |
| addWeeks(day,k) / weeksBetweenSabbaths(a,b) | D+7k; signed (b−a)/7 only after checking both endpoints. Invalid endpoint is a typed error. |

For positive divisor b, obtain truncating BigInt quotient t and remainder u. If u<0 return (t−1,u+b), otherwise (t,u). Use this primitive for all adapter year divisions too. Divide-by-zero and nonpositive denominators are internal contract errors. Never compare a Number remainder to a BigInt literal.

JavaScript Number stops distinguishing every integer past 2^53−1. Even a safe year can generate an unsafe intermediate. Date also clips at ±100,000,000 days from its epoch and supplies local-zone getters. Keep both outside chronology calculations. Native BigInt has finite implementation and memory limits. A resource error is distinct from an invalid chronological position. Browser input budgets belong to the shell. JSON stores decimal strings. [data models and interfaces](10-DATA-MODELS-AND-INTERFACES.md)

The core imports no adapters, DOM, clocks, remote services or locale data. Determinism depends only on input integers and the fixed anchor. BCE/CE support crosses the interface through an adapter which maps year-of-era to astronomical year before computing D. The core need never branch on a year. Use a constant count of integer operations for week jumps. Explicitly test the operation count as index magnitude grows. [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md)
