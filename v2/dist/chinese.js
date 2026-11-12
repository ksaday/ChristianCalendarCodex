import { absoluteDay } from "./chronology.js";
import { firstNewYear, lunarYears } from "./chinese-years.js";
const id = "chinese-hong-kong";
const evidence = "hko-daily-1901-2100-v1";
const firstDay = absoluteDay(2415386n);
const lastDay = absoluteDay(2488434n);
function describe() {
    return { id, revision: 1, evidence, firstDay, lastDay,
        convention: "Hong Kong Observatory Gregorian–lunar correspondence" };
}
function unsupported() {
    return { kind: "unsupported", reason: "Coverage is Gregorian 1901 through 2100",
        coverage: describe() };
}
const months = [];
const byYear = new Map();
let start = firstNewYear;
for (const [index, lengths] of lunarYears.entries()) {
    const year = BigInt(1900 + index);
    const yearMonths = [];
    let month = 0;
    for (const signedLength of lengths) {
        const isLeapMonth = signedLength < 0;
        if (!isLeapMonth)
            month++;
        const length = Math.abs(signedLength);
        const entry = { year, month, isLeapMonth, start, length };
        months.push(entry);
        yearMonths.push(entry);
        start += BigInt(length);
    }
    byYear.set(year, yearMonths);
}
const nearMidnightMoons = [2472635n, 2484299n, 2487193n]; // 2057, 2089, 2097
const nearMidnightTerms = new Set([2459570n, 2470251n, 2481894n, 2482304n]);
function result(value, entry, day) {
    if (nearMidnightMoons.some(moon => entry.start === moon || day === moon - 1n)) {
        return { kind: "uncertain", value, convention: id, evidence,
            reason: "HKO places this new moon near midnight. The lunar day can differ by one day." };
    }
    const note = nearMidnightTerms.has(day)
        ? "HKO flags the solar term on this date as close to midnight." : undefined;
    return { kind: "ok", value, convention: id, evidence, note };
}
function fromDay(day) {
    if (day < firstDay || day > lastDay)
        return unsupported();
    let low = 0;
    let high = months.length;
    while (high - low > 1) {
        const mid = Math.floor((low + high) / 2);
        if (months[mid].start <= day)
            low = mid;
        else
            high = mid;
    }
    const entry = months[low];
    const { year, month, isLeapMonth } = entry;
    return result({ year, month, isLeapMonth, day: Number(day - entry.start) + 1 }, entry, day);
}
function toDay({ year, month, isLeapMonth, day }) {
    if (typeof year !== "bigint")
        return { kind: "invalid", field: "year", reason: "Expected a bigint year" };
    const yearMonths = byYear.get(year);
    if (!yearMonths)
        return unsupported();
    if (!Number.isInteger(month) || month < 1 || month > 12) {
        return { kind: "invalid", field: "month", reason: "Expected a month from 1 to 12" };
    }
    if (typeof isLeapMonth !== "boolean") {
        return { kind: "invalid", field: "isLeapMonth", reason: "Specify regular or leap month" };
    }
    const entry = yearMonths.find(item => item.month === month && item.isLeapMonth === isLeapMonth);
    if (!entry)
        return { kind: "invalid", field: "isLeapMonth", reason: "No such leap month in this year" };
    if (!Number.isInteger(day) || day < 1 || day > entry.length) {
        return { kind: "invalid", field: "day", reason: "Day does not exist in this month" };
    }
    const value = absoluteDay(entry.start + BigInt(day - 1));
    if (value < firstDay || value > lastDay)
        return unsupported();
    return result(value, entry, value);
}
export const chinese = { describe, fromDay, toDay };
