import assert from "node:assert/strict";
import test from "node:test";
import { hebrew } from "../dist/hebrew.js";

test("daytime dates at the civil limits, Adar transition, new year and anniversary", () => {
  for (const [jdn, year, month, day] of [
    [2415386n, 5661n, "Tevet", 10], [2488434n, 5861n, "Kislev", 29],
    [2460380n, 5784n, "Adar I", 30], [2460381n, 5784n, "Adar II", 1],
    [2460586n, 5784n, "Elul", 29], [2460587n, 5785n, "Tishrei", 1],
    [2461135n, 5786n, "Nisan", 17]
  ]) {
    const fields = { year, month, day };
    assert.deepEqual(hebrew.fromDay(jdn).value, fields);
    assert.equal(hebrew.toDay(fields).value, jdn);
  }
});

test("partial years, unsupported days and impossible fields are distinguished", () => {
  const { firstDay, lastDay } = hebrew.describe();
  for (const jdn of [firstDay - 1n, lastDay + 1n, -(10n ** 200n)]) {
    assert.equal(hebrew.fromDay(jdn).kind, "unsupported");
  }
  for (const date of [
    { year: 5661n, month: "Tevet", day: 9 }, { year: 5861n, month: "Kislev", day: 30 },
    { year: 1000000000000000000n, month: "Tishrei", day: 1 }
  ]) assert.equal(hebrew.toDay(date).kind, "unsupported");
  for (const [year, month, day, field] of [
    [5785n, "Adar II", 1, "month"], [5784n, "Adar", 1, "month"], [5784n, "Adar II", 30, "day"],
    [5785n, "Elul", 1.5, "day"], [0n, "Nisan", 1, "year"]
  ]) assert.equal(hebrew.toDay({ year, month, day }).field, field);
});

test("each supported day matches ICU Hebrew fields and reverses to its JDN", () => {
  const format = new Intl.DateTimeFormat("en-US-u-ca-hebrew", {
    timeZone: "UTC", year: "numeric", month: "long", day: "numeric"
  });
  assert.equal(format.resolvedOptions().calendar, "hebrew");
  const spelling = { Tishri: "Tishrei", Heshvan: "Cheshvan", Tamuz: "Tammuz", Iyyar: "Iyar" };
  const { firstDay, lastDay } = hebrew.describe();
  for (let jdn = firstDay; jdn <= lastDay; jdn++) {
    const noon = new Date(Number(jdn - 2440588n) * 86400000 + 43200000);
    const parts = Object.fromEntries(format.formatToParts(noon).map(p => [p.type, p.value]));
    const expected = { year: BigInt(parts.year), month: spelling[parts.month] ?? parts.month, day: Number(parts.day) };
    assert.deepEqual(hebrew.fromDay(jdn).value, expected, String(jdn));
    assert.equal(hebrew.toDay(expected).value, jdn);
  }
});
