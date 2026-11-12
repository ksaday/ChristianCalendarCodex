import { absoluteDay, cycleOf, dayOf, divmod } from "./chronology.js";
import { astronomicalYear, gregorian, historicalYear, julian } from "./civil.js";
import { chinese } from "./chinese.js";
import { hebrew } from "./hebrew.js";
import { parseIndex } from "./selection.js";
const monthNames = "January February March April May June July August September October November December".split(" ");
export const weekdays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export function civilLabel(date) {
    const { era, yearOfEra } = historicalYear(date.year);
    const month = monthNames[date.month - 1];
    return date.day + " " + month + " " + yearOfEra + " " + era;
}
export function step(day, scale, count) {
    if (scale === "day" || scale === "week")
        return absoluteDay(day + count * (scale === "day" ? 1n : 7n));
    const date = gregorian.fromDay(day).value;
    const months = scale === "month" ? 1n : scale === "year" ? 12n : 1200n;
    const target = divmod(date.year * 12n + BigInt(date.month - 1) + months * count, 12n);
    let d = date.day;
    for (;;) {
        const result = gregorian.toDay({ year: target.quotient, month: Number(target.remainder) + 1, day: d });
        if (result.kind === "ok")
            return result.value;
        if (d <= 28)
            throw new Error(result.reason);
        d--;
    }
}
export function search(mode, fields) {
    if (mode === "sabbath")
        return dayOf(parseIndex(fields.index ?? ""));
    const raw = fields.year ?? "";
    if (raw.length > 4096 || !/^\d+$/.test(raw.trim()) || BigInt(raw) < 1n)
        throw new Error("Enter a positive year.");
    const year = BigInt(raw);
    const month = Number(fields.month);
    if (!/^\d{1,2}$/.test(fields.day ?? ""))
        throw new Error("Enter a whole day from 1 to 31.");
    const day = Number(fields.day);
    if (mode === "chinese" && !["regular", "leap"].includes(fields.kind ?? ""))
        throw new Error("Choose a month type.");
    const result = mode === "chinese" ? chinese.toDay({ year, month, day, isLeapMonth: fields.kind === "leap" })
        : mode === "hebrew" ? hebrew.toDay({ year, month: fields.month, day })
            : (mode === "julian" ? julian : gregorian).toDay({
                year: astronomicalYear(fields.era, year), month, day
            });
    if (result.kind === "ok" || result.kind === "uncertain")
        return result.value;
    throw new Error(result.reason);
}
export function rows(day) {
    const cycle = cycleOf(day);
    const h = hebrew.fromDay(day);
    const c = chinese.fromDay(day);
    const unavailable = "Outside 1901–2100";
    return [
        { name: "Sabbath", label: "#" + cycle.index.toLocaleString("en-US"), note: weekdays[Number(cycle.offset)] + " · Day " + (cycle.offset + 1n) + " of 7" },
        { name: "Hebrew", label: h.kind === "ok" ? h.value.day + " " + h.value.month + " " + h.value.year : unavailable, note: h.kind === "ok" ? "Calculated daytime date" : h.reason },
        { name: "Julian", label: civilLabel(julian.fromDay(day).value), note: "Proleptic Julian calendar" },
        { name: "Gregorian", label: civilLabel(gregorian.fromDay(day).value), note: "Proleptic Gregorian calendar" },
        { name: "Chinese", label: c.kind === "unsupported" ? unavailable :
                (c.value.isLeapMonth ? "Leap month " : "Month ") + c.value.month + " · Day " + c.value.day + " · " + c.value.year,
            note: c.kind === "ok" ? c.note ?? "Hong Kong lunisolar calendar" : c.reason }
    ];
}
// Map an integer pixel to a day using only viewport-relative quantities.
export function dayAtPixel(center, radius, width, pixel) {
    const w = Math.max(1, Math.round(width));
    const x = Math.min(w, Math.max(0, Math.round(pixel)));
    return absoluteDay(center - radius + (BigInt(x) * 2n * radius + BigInt(Math.floor(w / 2))) / BigInt(w));
}
