# Timeline and interaction design

The supplied drawing uses horizontal blue tracks, a cross at the fixed anchor, and a second vertical line at 3 October 2026. Its Sabbath #104,017 matches that day's JDN. Keep the historical marker anchored to its day as the user pans; the movable cursor identifies the selection. At deep zoom-out label the anchor region compactly. At week scale always render #0 between #−1 and #1. The image also sketches Chinese history, calculated eclipses, recorded eclipses and biblical events. Reserve those as sourced annotation tracks for a later decision. They have different evidence requirements from date conversion. [genesis creation research](08-GENESIS-CREATION-RESEARCH.md) · [owner approval checklist](16-OWNER-APPROVAL-CHECKLIST.md)

### Desktop · anchor selected, day-scale detail

~~~text
Find [ Sabbath number ▾ ] [ 1       ] [Go]    [Earlier] [Later] [Scale ▾]
                                  selected day
                                       │
Sabbath        #0 ──────────────────── #1 ─────────────────── #2
Hebrew                                 │ Outside verified coverage
Julian                                 │ 4 April 33 CE
Gregorian                              │ 2 April 33 CE
Chinese                                │ Outside verified coverage
                                       │
Anchor · Sabbath #1   |   JDN 1,733,205   |   Saturday · cycle offset 0
~~~

### Mobile · Friday immediately before #1

~~~text
[Find day or Sabbath]    [Scale: day]
[← day]    JDN 1,733,204    [day →]
Cycle #0 · Friday · day 7 of 7
Previous Sabbath #0     Next Sabbath #1
Gregorian      1 April 33 CE
Julian         3 April 33 CE
Hebrew         Outside verified coverage
Chinese        Outside verified coverage
[Conversion details]     [Jump to anchor]
~~~

Wide screens pin row headings outside the plotting area. On narrow screens put the primary week strip above a vertical list of selected-day labels. The detail panel gives convention, absolute day, coverage and evidence per row. Provide equivalent text for the cross, colored lines, warnings and offscreen anchor. Copy exact JDN or serial from details.

**Navigation contract.** Search mode explicitly chooses Sabbath number or a calendar with structured fields. Commit only on Go/Enter. Left/right move one day, Shift+Left/Right one week when timeline has focus. Earlier/Later use the selected navigation unit. Month/year/century steps add 1 month, 1 year or 100 years in proleptic Gregorian astronomical coordinates, clamping the day to the target month's last valid day per action. Label this basis in the scale control. Zoom changes tick density about the selected day without changing D. Clicking overlapping coarse ticks selects their labeled boundary, and details allow an exact day entry. Previous/Next Sabbath use strict neighbors, including on Saturdays. Today reads local civil fields once per action.

| Search flow | Cursor outcome |
|---|---|
| Enter #-1 | D=1733191, preceding #0 by one week. Next selects #0, again selects #1. |
| Enter #-1000000 | D=−5266802; both proleptic rows resolve, bounded adapters explain coverage. |
| Enter #100000000000000000000 | D=700000000000001733198; right-arrow adds exactly one day. |
| Choose Gregorian 3 October 2026 CE | D=2461317, exact #104017. All rows use this same D. |
| Choose Julian 29 February 1900 CE | Valid Julian leap day. Gregorian input with the same fields gives an inline day error. |

**Viewport arithmetic.** Compute tick boundaries as BigInts near the selected day. Use signed relative differences only. For viewport width W integer pixels and visible span V integer days, calculate pixel offset = floor((D−left)·W/V) in BigInt, then narrow only the clipped pixel to Number. Reverse pointer mapping uses left+floor(pixel·V/W), clamped to the visible half-open interval. Coarse collisions are resolved by zoom or direct entry. Render only visible ticks plus one tick on either side, thinning to at most 100 per row. At most five tracks and 510 tick elements including edge buffers. Discard or evict prior conversions at 1024 cache entries; recompute windows after jumps. No unbounded scroll width or absolute JDN in CSS pixels.

Provide native labeled forms, visible focus, minimum 44px target for primary navigation, logical tab order, an accessible selected-day definition list and one polite summary after each committed change. Keep redundant tick marks out of the tab order. Escape closes details and restores focus. Support 320px width, 200% zoom, reduced motion, high contrast and keyboard-only operation. [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md)
