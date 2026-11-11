import assert from "node:assert/strict";
import test from "node:test";
import { ANCHOR } from "../dist/chronology.js";
import { astronomicalYear, gregorian, historicalYear, julian } from "../dist/civil.js";

function check(adapter, jdn, year, month, day) {
  const date = { year, month, day };
  const forward = adapter.toDay(date);
  assert.equal(forward.kind, "ok");
  assert.equal(forward.value, jdn);
  assert.deepEqual(adapter.fromDay(jdn).value, date);
}

test("anchor, Julian epoch, reform and modern fixtures", () => {
  check(gregorian, ANCHOR, 33n, 4, 2);
  check(julian, ANCHOR, 33n, 4, 4);
  check(julian, 0n, -4712n, 1, 1);
  check(gregorian, 0n, -4713n, 11, 24);
  check(julian, 2299160n, 1582n, 10, 4);
  check(gregorian, 2299161n, 1582n, 10, 15);
  for (let day = 5; day < 15; day++) check(gregorian, 2299146n + BigInt(day), 1582n, 10, day);
  check(gregorian, 2461135n, 2026n, 4, 4);
  check(gregorian, 2461142n, 2026n, 4, 11);
  check(gregorian, 2461317n, 2026n, 10, 3);
});

test("calendar-specific validation and historical era transition", () => {
  assert.deepEqual(historicalYear(0n), { era: "BCE", yearOfEra: 1n });
  for (const year of [-9999n, -1n, 0n, 1n, 99n]) {
    const { era, yearOfEra } = historicalYear(year);
    assert.equal(astronomicalYear(era, yearOfEra), year);
  }
  assert.throws(() => astronomicalYear("CE", 0n));
  assert.throws(() => astronomicalYear("BCE", -1n));
  for (const adapter of [gregorian, julian]) {
    const end = adapter.toDay({ year: 0n, month: 12, day: 31 }).value;
    check(adapter, end + 1n, 1n, 1, 1);
    for (const [field, badValue] of [["day", 0], ["day", 32], ["day", NaN],
      ["month", 1.1], ["month", 0], ["month", 13], ["year", 33]]) {
      const result = adapter.toDay({ year: 33n, month: 1, day: 1, [field]: badValue });
      assert.equal(result.kind, "invalid");
      assert.equal(result.field, field);
    }
  }
  for (const year of [0n, 1900n, 2000n, 2100n]) {
    const date = { year, month: 2, day: 29 };
    assert.equal(julian.toDay(date).kind, "ok");
    assert.equal(gregorian.toDay(date).kind, year % 400n === 0n ? "ok" : "invalid");
  }
});

for (const [name, adapter, first, years, days] of [
  ["Gregorian", gregorian, 2451545n, 400, 146097n],
  ["Julian", julian, 2451558n, 4, 1461n]
]) {
  test(name + " full repeat period against a January-based month enumerator", () => {
    let jdn = first;
    for (let year = 2000; year < 2000 + years; year++) {
      const leap = year % 4 === 0 && (adapter === julian || year % 100 !== 0 || year % 400 === 0);
      const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= lengths[month - 1]; day++) {
          check(adapter, jdn++, BigInt(year), month, day);
        }
      }
    }
    assert.equal(jdn - first, days);
  });
  test(name + " translation to signed distant cycles", () => {
    for (const periods of [-(10n ** 4095n), -501n, 10n ** 4095n]) {
      for (const offset of [-1n, 0n, 59n, days - 1n, days]) {
        const original = adapter.fromDay(first + offset).value;
        check(adapter, first + periods * days + offset,
          original.year + periods * BigInt(years), original.month, original.day);
      }
    }
  });
}
