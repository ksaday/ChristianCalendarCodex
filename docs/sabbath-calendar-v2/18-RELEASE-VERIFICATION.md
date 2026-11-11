# MVP release candidate · verification record

Tested on November 11, 2026. Candidate file: `v2/dist/sabbath-calendar-v2.zip`. SHA-256: `1497d9b5a6fd358f4820a8d7d3039691c848586df885c211a9d6fac86da9b58f`. Two successive packages matched this fingerprint. The package is generated from versioned sources with fixed ZIP entry timestamps and a fixed asset list. The same archive can be served under a path prefix with its relative directory structure intact.

| Evidence | Observed result |
|---|---|
| TypeScript and functional checks | Strict compilation and all 21 tests passed, including exhaustive civil cycles, adapter bounds, leap months, signed coordinates and input validation. |
| Independent arithmetic checks | Python seed 1733205. All 432 vectors passed in both Node/V8 and Apple JavaScriptCore. |
| Calendar data | Hebrew daily checks used ICU; the Chinese adapter was checked directly against all 200 annual HKO source files. Both directions passed for all 73,049 days of each bounded profile. Individual near-midnight qualifications are described in the adapter documentation. |
| Static distribution | Chrome 157.0.8103.40 loaded the extracted archive at 1280 × 900. External requests were denied. With networking then disabled, searches in all five input modes, signed navigation and conversion details worked. A cold start still requires access to the static files. |
| Keyboard and accessibility | Day and week shortcuts, strict Sabbath navigation, invalid input preserving the previous selection, and Escape restoring dialog focus passed. Form controls expose stable field names. |
| Reflow | The timeline passed at 320 × 640 and at a 640 CSS-pixel viewport equivalent to the layout width of a 1280-pixel window at 200% zoom. At 320 pixels the Sabbath strip and all five date readouts remain visible. A distant negative selection stayed inside the viewport. |
| Stress and precision | 1,000 searches at each of five scales alternated between zero and positive/negative 101-digit indices. All 5,000 selected JDNs matched exact expectations. The plot held 25 tick labels throughout. |
| Legacy route | Packaged HTML, CSS and JavaScript matched baseline 6229702 byte for byte. With a frozen clock the browser passed the original self-check, Saturday countdown, anniversary popover, month navigation, Today, Friday countdown and pre-anchor seal checks. |

The release suite caught and now covers a hidden mobile Sabbath strip, a long selection heading overflowing a narrow viewport, and ambiguous accessible names on generated date fields.

## Review before deployment

The automated checks passed for this candidate. Spoken screen-reader output and a physical mobile device have not been independently verified. The browser reflow check measures CSS viewport width; it does not operate Chrome's native zoom menu. Owner acceptance of the interface, calendar coverage and production release remains open. Optional observance and Creation research remain outside this build.

Build, browser prerequisites and the two entry points are documented in the [V2 README](../../v2/README.md). To roll back the V2 route after deployment, withdraw the packaged v2 directory. The legacy files are identical to baseline.
