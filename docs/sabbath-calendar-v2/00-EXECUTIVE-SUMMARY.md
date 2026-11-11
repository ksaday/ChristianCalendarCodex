# Sabbath Calendar V2 · design review

**Recommendation.** Keep the existing month grid available at its current entry point. Add a static V2 timeline backed by an exact integer day engine. A visitor can select Sabbath #0, move a week in either direction, or jump directly to Sabbath #−1,000,000. The jump requires the same number of arithmetic operations as a jump to #1.

The anchor is Julian 4 April AD 33, JDN 1,733,205. Its proleptic Gregorian label is 2 April AD 33. The project defines this correspondence as Sabbath #1. The sequence and its inverse follow from this single choice. [mathematical foundation](04-MATHEMATICAL-FOUNDATION.md)

**What the review found.** The four-file baseline already calculates pre-anchor Saturdays, including zero, within a limited Gregorian year selector. The October example in the supplied drawing agrees with the source arithmetic. The anniversary in 2026 is April 4 (#103,991). April 11 (#103,992) independently exercises the built-in self-check. [existing project analysis](02-EXISTING-PROJECT-ANALYSIS.md)

**Release boundary.** The proposed MVP delivers reversible civil-date conversion, four calendar representation rows with explicit coverage, keyboard navigation and offline chronology. Hebrew and Chinese labels have narrower release windows. Local observance and Creation interpretation have separate evidence and approval gates. [calendar conversion design](07-CALENDAR-CONVERSION-DESIGN.md) · [genesis creation research](08-GENESIS-CREATION-RESEARCH.md) · [development roadmap](13-DEVELOPMENT-ROADMAP.md)

**Review order.** Read the inverse and cycle semantics first, then the conversion coverage and cursor examples. Review the decisions and sign-off record before authorizing implementation. [negative sabbath numbering](05-NEGATIVE-SABBATH-NUMBERING.md) · [ui ux design](11-UI-UX-DESIGN.md) · [architecture decisions](15-ARCHITECTURE-DECISIONS.md) · [owner approval checklist](16-OWNER-APPROVAL-CHECKLIST.md)

Evidence terms throughout this package: **VERIFIED** records inspected source or cited evidence. **DERIVED** follows from a formula. **ASSUMED** identifies a project convention. **PROPOSED** specifies future behavior. **UNRESOLVED** identifies evidence or approval still required. All implementation and release tests described here are prospective.

## Files in this design package

- [00-EXECUTIVE-SUMMARY.md](00-EXECUTIVE-SUMMARY.md)
- [01-PROJECT-VISION.md](01-PROJECT-VISION.md)
- [02-EXISTING-PROJECT-ANALYSIS.md](02-EXISTING-PROJECT-ANALYSIS.md)
- [03-SOFTWARE-REQUIREMENTS-SRS.md](03-SOFTWARE-REQUIREMENTS-SRS.md)
- [04-MATHEMATICAL-FOUNDATION.md](04-MATHEMATICAL-FOUNDATION.md)
- [05-NEGATIVE-SABBATH-NUMBERING.md](05-NEGATIVE-SABBATH-NUMBERING.md)
- [06-CHRONOLOGY-CORE-DESIGN.md](06-CHRONOLOGY-CORE-DESIGN.md)
- [07-CALENDAR-CONVERSION-DESIGN.md](07-CALENDAR-CONVERSION-DESIGN.md)
- [08-GENESIS-CREATION-RESEARCH.md](08-GENESIS-CREATION-RESEARCH.md)
- [09-SYSTEM-ARCHITECTURE.md](09-SYSTEM-ARCHITECTURE.md)
- [10-DATA-MODELS-AND-INTERFACES.md](10-DATA-MODELS-AND-INTERFACES.md)
- [11-UI-UX-DESIGN.md](11-UI-UX-DESIGN.md)
- [12-VERIFICATION-AND-TEST-PLAN.md](12-VERIFICATION-AND-TEST-PLAN.md)
- [13-DEVELOPMENT-ROADMAP.md](13-DEVELOPMENT-ROADMAP.md)
- [14-RISK-REGISTER.md](14-RISK-REGISTER.md)
- [15-ARCHITECTURE-DECISIONS.md](15-ARCHITECTURE-DECISIONS.md)
- [16-OWNER-APPROVAL-CHECKLIST.md](16-OWNER-APPROVAL-CHECKLIST.md)
- [17-REQUIREMENTS-TRACEABILITY.md](17-REQUIREMENTS-TRACEABILITY.md)
