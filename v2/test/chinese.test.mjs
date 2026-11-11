import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chinese } from "../dist/chinese.js";
import { gregorian } from "../dist/civil.js";

function jdn(year, month, day) {
  return gregorian.toDay({ year: BigInt(year), month, day }).value;
}

test("all daily labels match the HKO reference digest and reverse to their JDN", () => {
  const hash = createHash("sha256");
  const { firstDay, lastDay } = chinese.describe();
  for (let j = firstDay; j <= lastDay; j++) {
    const { value } = chinese.fromDay(j);
    const { year, month, isLeapMonth, day } = value;
    assert.equal(chinese.toDay(value).value, j);
    hash.update([j, year, month, Number(isLeapMonth), day].join(",") + "\n");
  }
  assert.equal(hash.digest("hex"), "2e5de95ea4ac103f64c0a50ccff112c86256aba48a36a3702fc7f7c4eb8cdf23");
});

test("lunar new year and leap-month transitions in Hong Kong civil time", () => {
  for (const [y, m, d, month, isLeapMonth, day] of [
    [2026, 2, 17, 1, false, 1],
    [2023, 2, 20, 2, false, 1],
    [2023, 3, 21, 2, false, 30], // March equinox in Hong Kong
    [2023, 3, 22, 2, true, 1],   // March 21 17:23 UTC new moon
    [2023, 4, 19, 2, true, 29],
    [2023, 4, 20, 3, false, 1]   // April 20 04:12 UTC new moon
  ]) {
    assert.deepEqual(chinese.fromDay(jdn(y, m, d)).value, { year: BigInt(y), month, isLeapMonth, day });
  }
});

test("near-midnight months and solar terms retain their qualifications", () => {
  for (const [y, m, d] of [[2057, 9, 28], [2089, 9, 4], [2097, 8, 7]]) {
    const start = jdn(y, m, d);
    assert.equal(chinese.fromDay(start).value.day, 1);
    for (const day of [start - 1n, start, start + 28n]) {
      const result = chinese.fromDay(day);
      assert.equal(result.kind, "uncertain");
      assert.equal(chinese.toDay(result.value).kind, "uncertain");
    }
    assert.equal(chinese.fromDay(start + 30n).kind, "ok");
  }
  for (const [y, m, d] of [[2021, 12, 21], [2051, 3, 20], [2083, 2, 3], [2084, 3, 19]]) {
    assert.match(chinese.fromDay(jdn(y, m, d)).note, /solar term/);
  }
});

test("partial lunar years, invalid fields and range limits", () => {
  const date = { year: 2023n, month: 2, isLeapMonth: true, day: 1 };
  for (const [field, bad] of [["year", 2023], ["month", 13], ["day", 30], ["day", 1.5], ["isLeapMonth", undefined]]) {
    assert.equal(chinese.toDay({ ...date, [field]: bad }).field, field);
  }
  assert.equal(chinese.toDay({ ...date, month: 7 }).kind, "invalid");
  for (const [year, month, day] of [[1900n, 11, 10], [2100n, 12, 2], [10n ** 1000n, 1, 1]]) {
    assert.equal(chinese.toDay({ year, month, isLeapMonth: false, day }).kind, "unsupported");
  }
  for (const day of [2415385n, 2488435n, -(10n ** 1000n)]) assert.equal(chinese.fromDay(day).kind, "unsupported");
});
