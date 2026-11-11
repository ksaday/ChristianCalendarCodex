# Existing project analysis

**VERIFIED baseline.** The parent working directory is `/Users/kchoe/Projects/Chistian Calendar`. Its existing ChristianCalendar checkout identifies upstream as `https://github.com/ksaday/ChristianCalendar.git`. A separate local clone of committed main at `6229702369afed375cfdbfaa5e6112052d94f57c` supplied the baseline. Initial status in the clone was clean, main tracking the local clone source. Its complete tracked inventory consists of the four files below. No AGENTS.md, dependency manifest, CI or separate test suite appears in that tree. Other work in the parent checkout was excluded.

| Source | Inspected behavior | V2 treatment |
|---|---|---|
| [README](../../README.md) | Describes static deployment, Saturday numbering, year-33 display and anniversary rule. | Keep entry point and interpretive attribution. |
| [HTML](../../index.html), lines 32–40, 59–94, 98 | Countdown status, 33–3000 input, teaching placeholders, self-check element and direct script load. | Preserve page. Give V2 its own entry. |
| [Stylesheet](../../css/style.css), lines 263–295, 475 onward | Today indicator, gold Sabbath seal, pre-anchor and milestone variants, small-screen adjustments. | Reuse the visual vocabulary with text equivalents. |
| [Script](../../js/calendar.js), lines 8–47 | Private IIFE, Number constant, floored Gregorian conversion pair, normalized weekday modulo, fractional division in sabbathNumber outside Saturday. | Reuse formulas and fixtures, expose separate exact-day and interval operations. |
| Same script, lines 67–80, 88–91, 119–142 | Year 33 special case, later first Saturday on/after Gregorian April 4, local Date for today, Friday sunset language without calculation. | Inject today at UI boundary. Retain anniversary convention. |
| Same script, lines 150–195, 201–277, 282–303 | Details dialog, integer week offset on Saturdays, monthly grid, positive thousandth milestones, keyboard activation, year clamp. Month rollover at a year limit can wrap within the clamped year. | Preserve legacy route. V2 jumps are direct and unclamped by civil year. |
| Same script, lines 305–323 | Two browser assertions combine anchor, weekday, serial and April 11 fixture. | Carry into standalone regression suite. |

**DERIVED audit.** Gregorian ordinal + 1,721,425 gives the following independent civil-day check. The legacy anniversary function is specified by the source. Its self-check does not assert the 2026 anniversary.

| Gregorian day | JDN | Saturday serial | Meaning |
|---|---:|---:|---|
| 0033-04-02 | 1733205 | 1 | Julian April 4 |
| 2026-04-04 | 2461135 | 103991 | 1,993rd anniversary |
| 2026-04-11 | 2461142 | 103992 | Footer fixture |
| 2026-10-03 | 2461317 | 104017 | Supplied sketch |

No arithmetic discrepancy in these fixtures. The drawing omits a visible zero between its labeled negative and positive markers. The formal sequence supplies that intermediate week. A general Julian converter, lunar adapters, arbitrary precision and location-specific sunset times are absent from the tracked script. This audit inspected source and recomputed fixtures, without exercising a browser session. [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md)
