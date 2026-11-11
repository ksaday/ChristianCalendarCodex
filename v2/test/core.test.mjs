import assert from "node:assert/strict";
import test from "node:test";
import * as core from "../dist/chronology.js";
import { loadSelection, parseIndex, saveSelection } from "../dist/selection.js";

test("anchor, zero, negative and legacy fixtures", () => {
  for (const [index, day] of [
    [-1000000n, -5266802n], [-1000n, 1726198n], [-2n, 1733184n], [-1n, 1733191n],
    [0n, 1733198n], [1n, 1733205n], [2n, 1733212n], [3n, 1733219n],
    [103991n, 2461135n], [103992n, 2461142n], [104017n, 2461317n], [1000000n, 8733198n]
  ]) {
    assert.equal(core.dayOf(index), day);
    assert.deepEqual(core.exactIndex(day), { kind: "exact", index });
  }
});

test("all offsets, signed intervals and strict/inclusive neighbors", () => {
  for (const n of [-(10n ** 100n), -1n, 0n, 1n, 2n, 2n ** 53n, 10n ** 100n]) {
    const start = core.dayOf(n);
    const end = core.dayOf(n + 1n);
    assert.equal(end - start, 7n);
    for (let offset = 0n; offset < 7n; offset++) {
      const day = core.addDays(start, offset);
      const cycle = { index: n, start, exclusiveEnd: end, offset };
      assert.deepEqual(core.cycleOf(day), cycle);
      assert.deepEqual(core.exactIndex(day), offset === 0n
        ? { kind: "exact", index: n } : { kind: "offSabbath", cycle });
      assert.equal(core.onOrBefore(day), start);
      assert.equal(core.previousStrict(day), offset === 0n ? start - 7n : start);
      assert.equal(core.onOrAfter(day), offset === 0n ? day : end);
      assert.equal(core.nextStrict(day), end);
      assert.equal(core.addWeeks(day, -n), core.dayOf(0n) + offset);
    }
    assert.deepEqual(core.weeksBetweenSabbaths(start, core.ANCHOR), { kind: "exact", weeks: 1n - n });
    assert.deepEqual(core.weeksBetweenSabbaths(start + 1n, end), { kind: "offSabbath", endpoint: "from" });
    assert.deepEqual(core.weeksBetweenSabbaths(start, end + 1n), { kind: "offSabbath", endpoint: "to" });
  }
});

test("Euclidean division and typed constructors", () => {
  for (const divisor of [1n, 7n, 400n]) {
    for (const value of [-1000n, -1n, 0n, 19n]) {
      const { quotient, remainder } = core.divmod(value, divisor);
      assert.equal(quotient * divisor + remainder, value);
      assert.ok(remainder >= 0n && remainder < divisor);
    }
  }
  for (const divisor of [0n, -1n]) assert.throws(() => core.divmod(1n, divisor), RangeError);
  for (const make of [core.absoluteDay, core.dayDelta, core.sabbathIndex]) {
    assert.throws(() => make(1), TypeError);
  }
});

test("manual input and canonical selection transport", () => {
  assert.equal(parseIndex("  #−001  "), -1n);
  assert.equal(parseIndex("#+0"), 0n);
  assert.equal(parseIndex("-0"), 0n);
  for (const input of ["#", " ", "1.2", "2e3", "0x10", "+-1", "1,000", "<b>"]) {
    assert.throws(() => parseIndex(input), SyntaxError);
  }
  const digits = "9".repeat(4096);
  assert.throws(() => parseIndex(digits + "1"), RangeError);
  const day = core.dayOf(parseIndex(digits));
  assert.equal(day.toString().length, 4097);
  assert.equal(loadSelection(saveSelection(day)), day);
  assert.equal(saveSelection(-1n), '{"version":1,"jdn":"-1"}');
  for (const jdn of ["-0", "01", "+1", " 1", "2\n", "", "1e3", 10, null]) {
    assert.throws(() => loadSelection(JSON.stringify({ version: 1, jdn })), SyntaxError);
  }
  assert.throws(() => loadSelection('{"version":2,"jdn":"0"}'), SyntaxError);
  assert.throws(() => loadSelection(" ".repeat(16385)), RangeError);
  assert.throws(() => loadSelection("é".repeat(8193)), RangeError);
});
