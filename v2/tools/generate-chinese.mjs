import { writeFileSync } from "node:fs";
import lunar from "lunar-javascript";

// One row per lunar year. A negative length identifies its repeated month.
const rows = [];
for (let year = 1900; year <= 2100; year++) {
  const months = lunar.LunarYear.fromYear(year).getMonthsInYear();
  const lengths = months.map(month => {
    const number = month.getMonth();
    let length = month.getDayCount();
    // HKO places the midnight-adjacent ninth new moon of 2057 one day earlier.
    if (year === 2057 && number === 8) length--;
    if (year === 2057 && number === 9) length++;
    if (length !== 29 && length !== 30) throw new Error("Invalid lunar month length");
    return number < 0 ? -length : length;
  });
  rows.push("  [" + lengths.join(", ") + "], // " + year);
}
const first = lunar.LunarYear.fromYear(1900).getMonthsInYear()[0].getFirstJulianDay();
writeFileSync(new URL("../src/chinese-years.ts", import.meta.url),
  "// Generated with tools/generate-chinese.mjs from lunar-javascript 1.7.7.\n" +
  "export const firstNewYear = " + first + "n;\n" +
  "export const lunarYears: readonly (readonly number[])[] = [\n" + rows.join("\n") + "\n];\n");
