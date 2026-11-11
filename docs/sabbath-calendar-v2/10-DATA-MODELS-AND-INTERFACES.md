# Data models and interfaces

| Value | Required fields and invariants |
|---|---|
| Selection | Schema version 1, selected absolute JDN. Persist only the canonical day and optional presentation preferences. Recompute labels on restore. |
| Cycle | Signed index, start D, exclusive end D=start+7, offset in 0…6. Exact Sabbath iff offset=0. |
| CivilDate | Calendar ID gregorian-proleptic or julian-proleptic, astronomical year BigInt, month 1…12, day validated against month. Form uses positive year-of-era and a required BCE/CE control. |
| HebrewDate | Fixed-calendar profile, positive AM year, stable named month including common Adar or leap Adar I/II, validated day. |
| ChineseDate | HKO profile and revision, numeric year of lunar new year, month 1…12, required isLeapMonth flag and validated day. |
| Coverage | Calendar and profile IDs, provider revision, inclusive first/last D or unbounded mathematical ends, verification corpus ID and warnings. |
| Result | ok(value, convention, evidence), uncertain(value, reason, evidence), unsupported(reason, coverage), invalid(field, reason), or unavailable(reason). |

Each adapter exposes describe(), fromDay(D), and toDay(fields). Both directions report the same convention. If an uncertain reverse result has competing absolute days, present candidates for explicit selection. Missing leap-month discriminator yields a field error before conversion. An unavailable local asset differs from a date outside coverage. [calendar conversion design](07-CALENDAR-CONVERSION-DESIGN.md)

**Wire example.** A saved selection of Sabbath #0 is `{"version":1,"jdn":"1733198"}`. Store BigInt fields as ASCII decimal strings matching `^(0|-?[1-9][0-9]*)$` with full-input consumption. Reject JSON numbers, leading zeros, plus signs and unknown versions on import. No exponent, grouping, implicit whitespace or floating coercion. Input forms may trim surrounding whitespace, strip one optional # prefix, translate a typographic minus, accept one sign, and normalize leading zeros before canonical serialization. Keep display grouping out of editable raw input.

**Budgets and integrity.** Propose a 4096-digit human input limit per signed integer (sign excluded), checked before BigInt construction. Limit an imported selection to 16 KiB UTF-8 before JSON parsing. These are interface budgets, not limits on core indices; computed D may have one more digit than the entered n. Permit persisted computed JDNs within the import byte budget even when longer than the manual form limit. Present a resource error and preserve the previous selection on excess input. Render user text as text nodes. For display cap visual width, provide wrapping details and a copy-exact action. Type branding prevents using a SabbathIndex as an AbsoluteDay. [chronology core design](06-CHRONOLOGY-CORE-DESIGN.md) · [ui ux design](11-UI-UX-DESIGN.md)
