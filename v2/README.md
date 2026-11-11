# Sabbath Calendar V2 · chronology and calendar adapters

V2 implements the integer day engine, selection transport, and Gregorian, Julian, calculated Hebrew, and Hong Kong Chinese adapters. The original calendar is available at [the legacy entry point](../index.html). The [approved design](../docs/sabbath-calendar-v2/00-EXECUTIVE-SUMMARY.md) describes the later calendar adapters and timeline.

## Open the timeline

From this directory run `npm ci`, `npm run build`, then `python3 -m http.server 8731 --directory ..`. Open [the local timeline](http://127.0.0.1:8731/v2/). The static page loads its compiled ES modules from `v2/dist/`. Serve the repository root to keep the original month-calendar link available.

Search by signed Sabbath number or by a date in any of the four calendars. Choose a scale to change the view around the selected day. Earlier and Later move one unit at that scale. Month, year and century steps follow Gregorian boundaries and clamp to the last day of a short month. Focus the timeline for left/right day steps or Shift+left/right week steps. Conversion details show exact values and each calendar’s coverage.

## Run the verification

From this directory, with Node 22 or later and npm, run:

~~~sh
npm ci
npm test
npm run test:oracle
~~~

The oracle command additionally requires Python 3 and the JavaScriptCore shell. On macOS it detects the system shell. Elsewhere set JSC to its executable path. The oracle generates a temporary module next to the compiled core and runs identical inputs through Node and JavaScriptCore. The library has no runtime dependencies. TypeScript is pinned in the lockfile.

## Try a selection

After building, run this command from this directory:

~~~sh
node --input-type=module -e 'import { dayOf, cycleOf } from "./dist/chronology.js"; import { parseIndex } from "./dist/selection.js"; console.log(cycleOf(dayOf(parseIndex("#-1000000"))));'
~~~

The expected index is −1,000,000, the start JDN is −5,266,802, and the exclusive end JDN is −5,266,795. Offset zero identifies the Sabbath itself. For a weekday, use cycleOf for its containing week or exactIndex to check whether the day itself is a Sabbath. Use branded constructors for direct TypeScript calls.

## Phase 1 evidence

The strict build and tests passed locally on Node v24.20.0 and TypeScript 5.9.3. Tests cover the immutable anchor, legacy fixtures, strict and inclusive neighbors, signed intervals, input budgets and canonical JSON. The instrumented jump test counts three integer operations to find a Sabbath day and two to move a selected day by weeks. Both counts hold for one-digit and 4096-digit input. Arithmetic cost within each operation still depends on operand size.

The independent Python oracle groups days relative to JDN 5, the first nonnegative Saturday, and compares their relative week ordinal with the project anchor. All 432 generated positions matched in both Node/V8 and Apple JavaScriptCore, including negative absolute days and positions derived from 4096-digit indices. To reproduce, use seed 1733205 in test/oracle.py.

## Civil calendar conversion

Import `gregorian` or `julian` from the built module. Each adapter accepts the same absolute day and returns its own calendar fields. Dates use astronomical bigint years. Use `astronomicalYear("BCE", 1n)` for 1 BCE and `historicalYear(year)` to recover its display era. Invalid inputs to `toDay` identify the field to correct.

~~~js
import { ANCHOR } from "./dist/chronology.js";
import { gregorian, julian } from "./dist/civil.js";

gregorian.fromDay(ANCHOR).value; // { year: 33n, month: 4, day: 2 }
julian.fromDay(ANCHOR).value;    // { year: 33n, month: 4, day: 4 }
julian.toDay({ year: 33n, month: 4, day: 4 }).value; // 1733205n
~~~

Both adapters use their named leap-year rule across all integer years. The civil-cycle-v1 tests verify every date in Gregorian years 2000–2399 and Julian years 2000–2003 against a month-by-month enumeration. Additional fixtures cover JDN zero, the BCE/CE boundary, October 1582, the project anchor and modern Sabbaths. Translation tests check selected dates across positive and negative 4096-digit cycle counts. Regional adoption dates and historical month naming are outside these proleptic profiles.

## Calculated Hebrew calendar

Import `hebrew` from `./dist/hebrew.js`. The adapter uses the Hebrew date during the daytime portion of the selected civil day. Its inclusive Gregorian coverage is January 1, 1901 through December 31, 2100. The first and last Hebrew years have partial coverage.

~~~js
hebrew.fromDay(2461135n).value; // { year: 5786n, month: "Nisan", day: 17 }
hebrew.toDay({ year: 5784n, month: "Adar II", day: 1 }).value; // 2460381n
~~~

Use the names Adar, Adar I and Adar II explicitly. An impossible month or day returns a field-specific invalid result. A position beyond coverage returns unsupported with the inclusive range. Other calendar rows and the core can still use the selected JDN.

The in-repository provider (revision 1) computes mean conjunctions, applies postponements and derives month lengths from consecutive Tishrei starts. It uses the published 1 Tishrei 5785 correspondence for its civil alignment and requires no external library or service. This implementation follows the fixed calendar rules in [Kiddush HaChodesh, chapter 6](https://www.chabad.org/library/article_cdo/aid/947923/jewish/Kiddush-HaChodesh-Chapter-Six.htm) and [chapter 7](https://www.chabad.org/library/article_cdo/aid/947925/jewish/Kiddush-HaChodesh-Chapter-Seven.htm).

The Hebrew suite compared all 73,049 covered days to Node ICU 78.3 in UTC and converted each expected label back to the same JDN. Published sample dates cover [30 Adar I](https://www.chabad.org/calendar/view/day.asp?hdate=12%2F30%2F5784&mode=j), [the next month's first day](https://he.chabad.org/calendar/view/month.asp?hdate=13%2F1%2F5784&mode=j), [Rosh Hashanah](https://www.chabad.org/calendar/view/day.asp?hdate=7%2F1%2F5785&mode=j), and [the 2026 anniversary](https://www.hebcal.com/converter?g2h=1&gd=4&gm=4&gy=2026). The Rosh Hashanah fixture is also the alignment point. The tests exercise the calculated convention; local sunset observance is a later layer.

## Hong Kong Chinese lunisolar calendar

Import `chinese` from `./dist/chinese.js`. The inclusive range is Gregorian 1901-01-01 through 2100-12-31. Year identifies the Gregorian year of lunar new year. A leap month repeats its preceding month number, so inverse conversion requires an explicit boolean.

~~~js
chinese.toDay({ year: 2023n, month: 2, isLeapMonth: true, day: 1 }); // Gregorian March 22
chinese.fromDay(2415386n).value; // { year: 1900n, month: 11, isLeapMonth: false, day: 11 }
~~~

A compact offline month index is generated with pinned MIT-licensed lunar-javascript 1.7.7. The generator adjusts the start of lunar month nine in 2057 to September 28 for the Hong Kong convention. The published tables were used for verification. The runtime contains the calculated index and requires no network or astronomy library. Regenerate it with `node tools/generate-chinese.mjs`. [Calculation package](https://github.com/6tail/lunar-javascript) · [HKO published tables and near-midnight exceptions](https://www.hko.gov.hk/en/gts/time/conversion.htm)

Both conversion directions return an uncertain result with the published value for months beginning at HKO’s three flagged new moons and on the immediately preceding civil day. The four flagged solar terms carry an informational note on their published date. Consumers should present these qualifications with the returned label. Dates outside coverage return unsupported, including the excluded portions of the endpoint lunar years.

**Verification.** Every one of the 73,049 published civil dates was compared field-by-field and converted back to its JDN. The offline test pins the SHA-256 of all canonical daily tuples. To repeat the direct comparison, save the 200 English HKO text tables as 1901.txt through 2100.txt in one directory, build, then run `node tools/check-hko.mjs /path/to/tables`. The checker also rejects missing or repeated civil days. Independent US Naval Observatory event times locate the March 2023 equinox on March 21 in Hong Kong, the next new moon on March 22 (leap month two), and the following new moon on April 20. These fixtures check selected astronomical boundaries. [HKO text file example](https://www.hko.gov.hk/en/gts/time/calendar/text/files/T2023e.txt) · [USNO lunar phases](https://aa.usno.navy.mil/calculated/moon/phases?date=2023-03-07&format=p&nump=50&submit=Get+Data) · [USNO equinox](https://aa.usno.navy.mil/calculated/seasons?dst=false&tz=0&year=2023)
