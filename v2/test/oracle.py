"""Compare compiled ES modules to Python's Saturday lattice in two JS engines."""
import argparse
import json
import os
from pathlib import Path
import random
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_JSC = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc"
SEED = 1733205
ANCHOR = 1733205


def cases():
    rng = random.Random(SEED)
    days = [-1, 0, 1, ANCHOR - 1, ANCHOR, ANCHOR + 1]
    for digits in (1, 3, 16, 64, 256, 1024, 4096):
        for _ in range(8):
            index = rng.randrange(10 ** (digits - 1), 10 ** digits) * rng.choice((-1, 1))
            days.extend(ANCHOR + 7 * (index - 1) + offset for offset in range(7))
    for sign in (-1, 1):
        days.extend(sign * 2 ** 53 + i for i in range(-8, 9))
    for day in days:
        # Python floor division groups Saturdays relative to JDN 5 (Monday = 0).
        week, offset = divmod(day - 5, 7)
        index = week - (ANCHOR - 5) // 7 + 1
        start = day - offset
        yield list(map(str, (day, index, offset, start, start + 7)))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--jsc", default=os.environ.get("JSC") or shutil.which("jsc") or DEFAULT_JSC)
    args = parser.parse_args()
    vectors = list(cases())
    runner = """
import { cycleOf, dayOf, addWeeks } from './chronology.js';
for (const [d, i, r, s, e] of VECTORS) {
  const day = BigInt(d);
  const cycle = cycleOf(day);
  if (String(cycle.index) !== i || String(cycle.offset) !== r ||
      String(cycle.start) !== s || String(cycle.exclusiveEnd) !== e ||
      dayOf(BigInt(i)) !== BigInt(s) || addWeeks(day, -BigInt(i)) !== 1733198n + BigInt(r)) {
    throw new Error('Oracle mismatch at JDN ' + d);
  }
}
"""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".mjs", dir=ROOT / "dist") as module:
        module.write(runner.replace("VECTORS", json.dumps(vectors)))
        module.flush()
        for command in (["node", module.name], [args.jsc, "-m", module.name]):
            subprocess.run(command, check=True)
            print(f"{Path(command[0]).name}: {len(vectors)} vectors passed, seed {SEED}")


if __name__ == "__main__":
    main()
