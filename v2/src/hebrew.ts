import { absoluteDay, type AbsoluteDay } from "./chronology.js";

type HebrewMonth = "Tishrei" | "Cheshvan" | "Kislev" | "Tevet" | "Shevat" |
  "Adar" | "Adar I" | "Adar II" | "Nisan" | "Iyar" | "Sivan" | "Tammuz" | "Av" | "Elul";

export interface HebrewDate {
  readonly year: bigint;
  readonly month: HebrewMonth;
  readonly day: number;
}

const id = "hebrew-fixed-daytime";
const evidence = "hebrew-fixed-1901-2100-v1";
const firstDay = absoluteDay(2415386n);
const lastDay = absoluteDay(2488434n);
const firstYear = 5661n;
const lastYear = 5861n;

function describe() {
  return { id, revision: 1, evidence, firstDay, lastDay,
    convention: "Calculated Hebrew date during the daytime portion of the civil day" } as const;
}

function unsupported() {
  return { kind: "unsupported", reason: "Coverage is Gregorian 1901 through 2100",
    coverage: describe() } as const;
}

function leap(year: bigint) {
  return (7n * year + 1n) % 19n < 7n;
}

// Sunday is weekday zero. One hour contains 1080 parts.
function newYearOrdinal(year: bigint): bigint {
  const monthsElapsed = (235n * year - 234n) / 19n;
  const partsPerDay = 24n * 1080n;
  const partsPerMonth = 29n * partsPerDay + 12n * 1080n + 793n;
  const parts = 5n * 1080n + 204n + monthsElapsed * partsPerMonth;
  let day = 1n + parts / partsPerDay;
  const time = parts % partsPerDay;
  const weekday = day % 7n;
  const lateMolad = time >= 18n * 1080n;
  const ordinaryTuesday = weekday === 2n && !leap(year) && time >= 9n * 1080n + 204n;
  const mondayAfterLeap = weekday === 1n && leap(year - 1n) && time >= 15n * 1080n + 589n;
  if (lateMolad || ordinaryTuesday || mondayAfterLeap) day++;
  const candidate = day % 7n;
  if (candidate === 0n || candidate === 3n || candidate === 5n) day++;
  return day;
}

// 1 Tishrei 5785 corresponds to Gregorian 2024-10-03.
const ordinalOffset = 2460587n - newYearOrdinal(5785n);
const yearStart = (year: bigint) => ordinalOffset + newYearOrdinal(year);

function monthsOf(year: bigint): [HebrewMonth, number][] {
  const yearLength = yearStart(year + 1n) - yearStart(year);
  const months: [HebrewMonth, number][] = [
    ["Tishrei", 30], ["Cheshvan", yearLength % 10n === 5n ? 30 : 29],
    ["Kislev", yearLength % 10n === 3n ? 29 : 30], ["Tevet", 29], ["Shevat", 30]
  ];
  if (leap(year)) months.push(["Adar I", 30], ["Adar II", 29]);
  else months.push(["Adar", 29]);
  months.push(["Nisan", 30], ["Iyar", 29], ["Sivan", 30], ["Tammuz", 29], ["Av", 30], ["Elul", 29]);
  return months;
}

function fromDay(day: AbsoluteDay) {
  if (day < firstDay || day > lastDay) return unsupported();
  let year = firstYear;
  let upper = lastYear + 1n;
  while (upper - year > 1n) {
    const mid = (upper + year) / 2n;
    if (yearStart(mid) <= day) year = mid;
    else upper = mid;
  }
  let offset = Number(day - yearStart(year)); // Within one Hebrew year.
  for (const [month, length] of monthsOf(year)) {
    if (offset < length) {
      return { kind: "ok", value: { year, month, day: offset + 1 }, convention: id, evidence } as const;
    }
    offset -= length;
  }
  throw new Error("Hebrew month lengths do not span the year");
}

function toDay({ year, month, day }: HebrewDate) {
  if (typeof year !== "bigint" || year < 1n) {
    return { kind: "invalid", field: "year", reason: "Expected a positive bigint AM year" } as const;
  }
  if (year < firstYear || year > lastYear) return unsupported();
  let start = yearStart(year);
  for (const [name, length] of monthsOf(year)) {
    if (name === month) {
      if (!Number.isInteger(day) || day < 1 || day > length) {
        return { kind: "invalid", field: "day", reason: "Day does not exist in this month" } as const;
      }
      const value = absoluteDay(start + BigInt(day - 1));
      if (value < firstDay || value > lastDay) return unsupported();
      return { kind: "ok", value, convention: id, evidence } as const;
    }
    start += BigInt(length);
  }
  return { kind: "invalid", field: "month", reason: "Month does not exist in this year" } as const;
}

export const hebrew = { describe, fromDay, toDay } as const;
