# Project vision

A visitor selecting a date has two different questions: “Is this day itself a Sabbath?” and “Which seven-day interval contains it?” V2 answers both, then shows how each supported calendar names the selected day. A researcher can copy the integer JDN and reproduce the selection on another computer.

| User journey | Successful outcome |
|---|---|
| Trace the weeks surrounding the anchor | Step from −1 to 0 to 1, reading signed indices and the two historical calendar labels at #1. |
| Compare traditions | Read the daytime Hebrew label beside a civil label and see the calculation convention and source. |
| Explore deep time | Jump directly to a signed index. Keep the exact result visible even when a calendar row reaches its evidence boundary. |
| Return to the familiar month view | Reach the original page and recognize its Saturday seals, anniversary and countdown. |

The first release uses the civil Saturday as the first indexed day of a Saturday–Friday interval. This makes the date of each named Sabbath its left endpoint. A Friday belongs to the preceding mathematical interval even when worshippers locally begin observing the upcoming Sabbath that evening. Selection accepts a day label, so it needs neither a clock time nor a location. [mathematical foundation](04-MATHEMATICAL-FOUNDATION.md)

The historical anchor marker describes the project's convention. Calculated dates can be exact under a rule while offering limited evidence about what people called a date in antiquity. A proposed interpretive boundary would annotate a named research model and leave the full sequence accessible. [genesis creation research](08-GENESIS-CREATION-RESEARCH.md)

Success requires preserving the legacy results, exact inverse navigation at distant positions, and an accessible alternative to reading a graphic. The first release has no requirement for accounts, persisted calendar records, teaching-video changes or location services. [software requirements srs](03-SOFTWARE-REQUIREMENTS-SRS.md) · [verification and test plan](12-VERIFICATION-AND-TEST-PLAN.md)
