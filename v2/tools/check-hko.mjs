// Pass a directory containing HKO English annual tables named 1901.txt … 2100.txt.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { chinese } from "../dist/chinese.js";

const directory = process.argv[2];
if (!directory) throw new Error("Pass the directory containing 200 annual HKO text tables");
const hash = createHash("sha256");
let cursor = 2415386n;
let year = 1900n;
let month = 11;
let isLeapMonth = false;
for (let civilYear = 1901; civilYear <= 2100; civilYear++) {
  const contents = readFileSync(join(directory, civilYear + ".txt"), "latin1");
  for (const line of contents.split(/\r?\n/)) {
    const row = /^\s*(\d{4})\/(\d+)\/(\d+)\s+(\d+)(?:(st|nd|rd|th)\s+lunar month)?\s/i.exec(line);
    if (!row) continue;
    const [, y, m, d, lunar, ordinal] = row;
    assert.equal(Number(y), civilYear);
    const jdn = BigInt(Date.UTC(+y, +m - 1, +d) / 86400000) + 2440588n;
    assert.equal(jdn, cursor++, "Missing or repeated civil day: " + line);
    let day = Number(lunar);
    if (ordinal) {
      isLeapMonth = day === month;
      month = day;
      if (month === 1 && !isLeapMonth) year = BigInt(y);
      day = 1;
    }
    const expected = { year, month, isLeapMonth, day };
    assert.deepEqual(chinese.fromDay(jdn).value, expected, line);
    assert.equal(chinese.toDay(expected).value, jdn, line);
    hash.update([jdn, year, month, Number(isLeapMonth), day].join(",") + "\n");
  }
}
assert.equal(cursor, 2488435n);
console.log("73049 HKO days verified in both directions. SHA-256", hash.digest("hex"));
