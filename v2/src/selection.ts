import { absoluteDay, sabbathIndex, type AbsoluteDay, type SabbathIndex } from "./chronology.js";

const INPUT_DIGITS = 4096;
const MAX_IMPORT_BYTES = 16384;

export function parseIndex(input: string): SabbathIndex {
  // Bound work before trimming, normalizing or constructing the integer.
  if (input.length > INPUT_DIGITS + 32) throw new RangeError("Input exceeds text budget");
  const text = input.trim().replace(/^#/, "").replace(/^−/, "-");
  const digits = text.replace(/^[+-]/, "");
  if (digits.length > INPUT_DIGITS) throw new RangeError("Maximum 4096 digits");
  if (!digits || /[^0-9]/.test(digits)) throw new SyntaxError("Enter a signed decimal Sabbath number");
  return sabbathIndex(BigInt(text));
}

export function saveSelection(day: AbsoluteDay): string {
  const json = JSON.stringify({ version: 1, jdn: absoluteDay(day).toString() });
  if (json.length > MAX_IMPORT_BYTES) throw new RangeError("Selection exceeds file budget");
  return json;
}

export function loadSelection(json: string): AbsoluteDay {
  if (json.length > MAX_IMPORT_BYTES || new TextEncoder().encode(json).length > MAX_IMPORT_BYTES) {
    throw new RangeError("Selection exceeds file budget");
  }
  const data: unknown = JSON.parse(json);
  if (typeof data !== "object" || data === null || !("version" in data) || data.version !== 1 ||
      !("jdn" in data) || typeof data.jdn !== "string") {
    throw new SyntaxError("Expected a version 1 selection with a decimal JDN string");
  }
  const canonical = parseCanonicalInteger(data.jdn);
  return absoluteDay(canonical);
}

function parseCanonicalInteger(text: string): bigint {
  const digits = text.startsWith("-") ? text.slice(1) : text;
  if (!digits || /[^0-9]/.test(digits) || (digits.startsWith("0") && text !== "0")) {
    throw new SyntaxError("Expected a canonical decimal integer");
  }
  return BigInt(text);
}
