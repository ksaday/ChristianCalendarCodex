function requireInteger(value) {
    if (typeof value !== "bigint")
        throw new TypeError("Expected a bigint");
    return value;
}
export const absoluteDay = (value) => requireInteger(value);
export const sabbathIndex = (value) => requireInteger(value);
export const dayDelta = (value) => requireInteger(value);
export const ANCHOR = absoluteDay(1733205n);
const WEEK = 7n;
export function divmod(value, divisor) {
    if (divisor <= 0n)
        throw new RangeError("Expected a positive divisor");
    const quotient = value / divisor;
    const remainder = value % divisor;
    return remainder < 0n
        ? { quotient: quotient - 1n, remainder: remainder + divisor }
        : { quotient, remainder };
}
export function dayOf(index) {
    return absoluteDay(ANCHOR + WEEK * (index - 1n));
}
export function cycleOf(day) {
    const { quotient, remainder } = divmod(day - ANCHOR, WEEK);
    const start = absoluteDay(day - remainder);
    return {
        index: sabbathIndex(quotient + 1n),
        start,
        exclusiveEnd: absoluteDay(start + WEEK),
        offset: dayDelta(remainder)
    };
}
export function exactIndex(day) {
    const cycle = cycleOf(day);
    if (cycle.offset === 0n)
        return { kind: "exact", index: cycle.index };
    return { kind: "offSabbath", cycle };
}
export function previousStrict(day) {
    const cycle = cycleOf(day);
    return cycle.offset === 0n ? absoluteDay(day - WEEK) : cycle.start;
}
export function nextStrict(day) {
    return cycleOf(day).exclusiveEnd;
}
export function onOrBefore(day) {
    return cycleOf(day).start;
}
export function onOrAfter(day) {
    const cycle = cycleOf(day);
    return cycle.offset === 0n ? day : cycle.exclusiveEnd;
}
export function addDays(day, days) {
    return absoluteDay(day + days);
}
export function addWeeks(day, weeks) {
    return absoluteDay(day + WEEK * weeks);
}
export function weeksBetweenSabbaths(from, to) {
    if (exactIndex(from).kind !== "exact")
        return { kind: "offSabbath", endpoint: "from" };
    if (exactIndex(to).kind !== "exact")
        return { kind: "offSabbath", endpoint: "to" };
    return { kind: "exact", weeks: (to - from) / WEEK };
}
