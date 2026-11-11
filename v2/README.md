# Sabbath Calendar V2 · chronology and civil calendars

V2 implements the integer day engine, selection transport, and proleptic Gregorian and Julian adapters. The original calendar is available at [the legacy entry point](../index.html). The [approved design](../docs/sabbath-calendar-v2/00-EXECUTIVE-SUMMARY.md) describes the later calendar adapters and timeline.

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

The next calendar milestones are the bounded Hebrew and Chinese representations.
