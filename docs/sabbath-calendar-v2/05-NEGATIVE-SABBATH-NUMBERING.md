# Zero and negative Sabbath numbers

Zero is an ordinary index one week before #1. Negative indices count backward from zero. The signed difference in indices always equals the elapsed difference in weeks. This rule applies across zero and independently of how an adapter expresses BCE years.

| Index | Exact Sabbath JDN | Cycle ends, inclusive |
|---:|---:|---:|
| −1,000,000 | −5266802 | −5266796 |
| −1,000 | 1726198 | 1726204 |
| −2 | 1733184 | 1733190 |
| −1 | 1733191 | 1733197 |
| 0 | 1733198 | 1733204 |
| 1 | 1733205 | 1733211 |
| 2 | 1733212 | 1733218 |
| 1,000,000 | 8733198 | 8733204 |

**The critical Friday.** For D=1733204 the displacement is −1. Dividing toward zero would put the day in cycle #1 with a negative offset. Euclidean division gives q=−1, r=6, so this is Friday in cycle #0. Strict previous is 1733198 and strict next is 1733205. For D=1733198, strict previous is 1733191 and strict next is 1733205. Inclusive navigation can return the selected day. [mathematical foundation](04-MATHEMATICAL-FOUNDATION.md)

Accept a keyboard minus and normalize a pasted typographic minus at the human-input boundary. Render negative values with a visible minus and provide a spoken label such as “Sabbath minus one.” Normalize entered negative zero to zero in the selection. Transport has one spelling of zero. Grouping is for display only. Never remove a week to imitate historical year numbering. A calendar adapter handles astronomical year zero separately. [data models and interfaces](10-DATA-MODELS-AND-INTERFACES.md) · [ui ux design](11-UI-UX-DESIGN.md)

Verification must exercise all seven offsets around each sample, especially r=6 immediately before zero and before one. Check a negative absolute JDN independently of a negative index: most small negative indices still have positive JDNs. [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md)
