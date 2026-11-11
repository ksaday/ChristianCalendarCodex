declare const unit: unique symbol;
type Integer<Unit extends string> = bigint & { readonly [unit]: Unit };

export type AbsoluteDay = Integer<"absolute-day">;
export type SabbathIndex = Integer<"sabbath-index">;
export type DayDelta = Integer<"day-delta">;

function requireInteger(value: bigint): bigint {
  if (typeof value !== "bigint") throw new TypeError("Expected a bigint");
  return value;
}

export const absoluteDay = (value: bigint) => requireInteger(value) as AbsoluteDay;
export const sabbathIndex = (value: bigint) => requireInteger(value) as SabbathIndex;
export const dayDelta = (value: bigint) => requireInteger(value) as DayDelta;

export const ANCHOR = absoluteDay(1733205n);
const WEEK = 7n;

export function divmod(value: bigint, divisor: bigint) {
  if (divisor <= 0n) throw new RangeError("Expected a positive divisor");
  const quotient = value / divisor;
  const remainder = value % divisor;
  return remainder < 0n
    ? { quotient: quotient - 1n, remainder: remainder + divisor }
    : { quotient, remainder };
}

export function dayOf(index: SabbathIndex): AbsoluteDay {
  return absoluteDay(ANCHOR + WEEK * (index - 1n));
}

export function cycleOf(day: AbsoluteDay) {
  const { quotient, remainder } = divmod(day - ANCHOR, WEEK);
  const start = absoluteDay(day - remainder);
  return {
    index: sabbathIndex(quotient + 1n),
    start,
    exclusiveEnd: absoluteDay(start + WEEK),
    offset: dayDelta(remainder)
  } as const;
}

export function exactIndex(day: AbsoluteDay) {
  const cycle = cycleOf(day);
  if (cycle.offset === 0n) return { kind: "exact", index: cycle.index } as const;
  return { kind: "offSabbath", cycle } as const;
}

export function previousStrict(day: AbsoluteDay): AbsoluteDay {
  const cycle = cycleOf(day);
  return cycle.offset === 0n ? absoluteDay(day - WEEK) : cycle.start;
}

export function nextStrict(day: AbsoluteDay): AbsoluteDay {
  return cycleOf(day).exclusiveEnd;
}

export function onOrBefore(day: AbsoluteDay): AbsoluteDay {
  return cycleOf(day).start;
}

export function onOrAfter(day: AbsoluteDay): AbsoluteDay {
  const cycle = cycleOf(day);
  return cycle.offset === 0n ? day : cycle.exclusiveEnd;
}

export function addDays(day: AbsoluteDay, days: DayDelta): AbsoluteDay {
  return absoluteDay(day + days);
}

export function addWeeks(day: AbsoluteDay, weeks: bigint): AbsoluteDay {
  return absoluteDay(day + WEEK * weeks);
}

export function weeksBetweenSabbaths(from: AbsoluteDay, to: AbsoluteDay) {
  if (exactIndex(from).kind !== "exact") return { kind: "offSabbath", endpoint: "from" } as const;
  if (exactIndex(to).kind !== "exact") return { kind: "offSabbath", endpoint: "to" } as const;
  return { kind: "exact", weeks: (to - from) / WEEK } as const;
}
