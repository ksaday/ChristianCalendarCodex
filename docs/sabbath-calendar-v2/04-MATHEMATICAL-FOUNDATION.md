# Mathematical foundation

**ASSUMED coordinate.** D is the integer JDN associated with civil noon on the labeled day. If starting with a conventional astronomical JD, the civil-day integer is floor(JD + ½) in the chosen reference day convention. Core inputs already are integers. An observer's local civil date is converted as calendar fields, without translating local midnight through UTC. [US Naval Observatory](https://aa.usno.navy.mil/data/JulianDate)

Let A = 1733205 and n ∈ ℤ. Define S(n) = A + 7(n − 1). Then S(1) = A. Subtracting S(n) from S(n+1) cancels both A and n and leaves 7. Replacing n by n−1 gives the corresponding backward difference. More generally S(n+k)−S(n)=7k. Thus S is strictly increasing and injective. Its image is precisely the integers congruent to A modulo 7. A mod 7 = 5 corresponds to Saturday in the source's Monday-zero convention. [existing project analysis](02-EXISTING-PROJECT-ANALYSIS.md)

**Inverse and partition.** Euclidean division uniquely writes D−A = 7q+r with 0 ≤ r < 7. The containing index is c=q+1 and start=S(c)=D−r. The half-open interval [start,start+7) contains D. Adjacent intervals share an endpoint assigned only to the later interval. Every integer day therefore belongs to exactly one cycle. When D=S(n), q=n−1 and r=0, proving the exact inverse gives n. For r>0 the exact-Sabbath inverse returns an off-Sabbath result.

| Question | Result |
|---|---|
| Sabbath on or before D | D−r |
| Sabbath strictly before D | D−r if r>0, otherwise D−7 |
| Sabbath on or after D | D if r=0, otherwise D−r+7 |
| Sabbath strictly after D | D−r+7 |

A day step adds k. A week step adds 7k and preserves r. No equation requires materializing a prior Sabbath. An integer operation count independent of elapsed weeks still incurs time and memory proportional to operand size for basic addition and small-constant arithmetic. [negative sabbath numbering](05-NEGATIVE-SABBATH-NUMBERING.md) · [chronology core design](06-CHRONOLOGY-CORE-DESIGN.md)
