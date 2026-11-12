import { absoluteDay, divmod } from "./chronology.js";
export function astronomicalYear(era, yearOfEra) {
    if (typeof yearOfEra !== "bigint" || yearOfEra < 1n) {
        throw new RangeError("Year of era must be a positive bigint");
    }
    if (era === "BCE")
        return 1n - yearOfEra;
    if (era === "CE")
        return yearOfEra;
    throw new RangeError("Expected BCE or CE");
}
export function historicalYear(year) {
    if (typeof year !== "bigint")
        throw new TypeError("Expected an astronomical bigint year");
    return year <= 0n
        ? { era: "BCE", yearOfEra: 1n - year }
        : { era: "CE", yearOfEra: year };
}
function civilAdapter(id) {
    const gregorianRule = id === "gregorian-proleptic";
    const yearsPerCycle = gregorianRule ? 400n : 4n;
    const daysPerCycle = gregorianRule ? 146097n : 1461n;
    const marchEpoch = gregorianRule ? 1721120n : 1721118n; // March 1, astronomical year 0.
    const evidence = "civil-cycle-v1";
    const describe = () => ({
        id, revision: 1, evidence, firstDay: null, lastDay: null,
        convention: "Proleptic civil calendar with astronomical year numbering"
    });
    // Within a March-based cycle leap days fall at the end of each leap year.
    function yearStart(localYear) {
        const base = 365n * localYear + localYear / 4n;
        return gregorianRule ? base - localYear / 100n + localYear / 400n : base;
    }
    function daysInMonth(year, month) {
        if (month === 2) {
            const leap = year % 4n === 0n &&
                (!gregorianRule || year % 100n !== 0n || year % 400n === 0n);
            return leap ? 29 : 28;
        }
        return [4, 6, 9, 11].includes(month) ? 30 : 31;
    }
    function toDay({ year, month, day }) {
        if (typeof year !== "bigint") {
            return { kind: "invalid", field: "year", reason: "Expected an astronomical bigint year" };
        }
        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return { kind: "invalid", field: "month", reason: "Month must be 1 through 12" };
        }
        if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) {
            return { kind: "invalid", field: "day", reason: "Day does not exist in this month" };
        }
        const marchYear = month < 3 ? year - 1n : year;
        const cycle = divmod(marchYear, yearsPerCycle);
        const marchMonth = BigInt((month + 9) % 12);
        const monthStart = (153n * marchMonth + 2n) / 5n;
        const value = absoluteDay(marchEpoch + cycle.quotient * daysPerCycle +
            yearStart(cycle.remainder) + monthStart + BigInt(day - 1));
        return { kind: "ok", value, convention: id, evidence };
    }
    function fromDay(day) {
        const cycle = divmod(day - marchEpoch, daysPerCycle);
        let low = 0n;
        let high = yearsPerCycle;
        while (high - low > 1n) {
            const mid = (low + high) / 2n;
            if (yearStart(mid) <= cycle.remainder)
                low = mid;
            else
                high = mid;
        }
        const dayOfYear = cycle.remainder - yearStart(low);
        const marchMonth = (5n * dayOfYear + 2n) / 153n;
        const month = Number((marchMonth + 2n) % 12n) + 1;
        const value = {
            year: cycle.quotient * yearsPerCycle + low + (month < 3 ? 1n : 0n),
            month,
            day: Number(dayOfYear - (153n * marchMonth + 2n) / 5n) + 1
        };
        return { kind: "ok", value, convention: id, evidence };
    }
    return { describe, toDay, fromDay };
}
export const gregorian = civilAdapter("gregorian-proleptic");
export const julian = civilAdapter("julian-proleptic");
