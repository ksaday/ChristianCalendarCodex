import { absoluteDay, ANCHOR, cycleOf, nextStrict, previousStrict, type AbsoluteDay } from "./chronology.js";
import { gregorian, julian } from "./civil.js";
import { hebrew } from "./hebrew.js";
import { chinese } from "./chinese.js";
import { civilLabel, dayAtPixel, rows, search, step, weekdays, type Scale, type SearchMode } from "./timeline.js";

function element<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error("Missing element " + id);
  return node as T;
}
function textNode(tag: string, value: string, className = "") {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = value;
  return node;
}
function today(): AbsoluteDay {
  const now = new Date();
  const result = gregorian.toDay({ year: BigInt(now.getFullYear()), month: now.getMonth() + 1, day: now.getDate() });
  if (result.kind !== "ok") throw new Error(result.reason);
  return result.value;
}
const plot = element("plot");
const modeControl = element<HTMLSelectElement>("mode");
const scaleControl = element<HTMLSelectElement>("scale");
const dialog = element<HTMLDialogElement>("dialog");
let selected = today();
let radius = 1n;
const scale = () => scaleControl.value as Scale;

function field(name: string, title: string, options?: string[], value = "") {
  const label = textNode("label", title);
  const control = options ? document.createElement("select") : document.createElement("input");
  control.name = name;
  if (control instanceof HTMLSelectElement) {
    for (const option of options!) control.add(new Option(option, option));
  } else {
    control.required = true;
    control.maxLength = name === "index" ? 4128 : 4096;
    control.inputMode = name === "index" ? "text" : "numeric";
    if (name === "day" || name === "month") control.style.width = "5em";
  }
  if (value) control.value = value;
  label.append(control);
  element("fields").append(label);
}
function setupFields() {
  element("fields").replaceChildren();
  element("error").textContent = "";
  const mode = modeControl.value;
  if (mode === "sabbath") {
    field("index", "Number", undefined, String(cycleOf(selected).index));
    return;
  }
  const h = hebrew.fromDay(selected);
  const c = chinese.fromDay(selected);
  const civil = (mode === "julian" ? julian : gregorian).fromDay(selected).value;
  let year = civil.year > 0n ? civil.year : 1n - civil.year;
  let month = String(civil.month);
  let day = civil.day;
  if (mode === "hebrew") {
    year = h.kind === "ok" ? h.value.year : 5786n;
    month = h.kind === "ok" ? h.value.month : "Tishrei";
    day = h.kind === "ok" ? h.value.day : 1;
  } else if (mode === "chinese") {
    year = c.kind === "unsupported" ? 2026n : c.value.year;
    month = c.kind === "unsupported" ? "1" : String(c.value.month);
    day = c.kind === "unsupported" ? 1 : c.value.day;
  }
  field("year", mode === "hebrew" ? "Year (AM)" : "Year", undefined, String(year));
  if (mode === "gregorian" || mode === "julian") field("era", "Era", ["CE", "BCE"], civil.year > 0n ? "CE" : "BCE");
  const names = ["Tishrei","Cheshvan","Kislev","Tevet","Shevat","Adar","Adar I","Adar II","Nisan","Iyar","Sivan","Tammuz","Av","Elul"];
  field("month", "Month", mode === "hebrew" ? names : Array.from({ length: 12 }, (_, i) => String(i + 1)), month);
  if (mode === "chinese") field("kind", "Month type", ["regular", "leap"], c.kind !== "unsupported" && c.value.isLeapMonth ? "leap" : "regular");
  field("day", "Day", undefined, String(day));
}

function render(announce = true) {
  const cycle = cycleOf(selected);
  const representations = rows(selected);
  const heading = "Sabbath " + representations[0]!.label;
  element("headline").textContent = heading;
  const dateLabel = weekdays[Number(cycle.offset)] + " · " + civilLabel(gregorian.fromDay(selected).value);
  element("subtitle").textContent = dateLabel;
  element("jdn").textContent = "JDN " + selected.toLocaleString("en-US");
  const ends = [-2n, -1n, 0n, 1n, 2n].map(n => step(selected, scale(), n));
  const extent = [selected - ends[0]!, ends[4]! - selected].reduce((a,b) => a > b ? a : b);
  radius = extent * 5n / 4n + 1n;
  const percent = (day: bigint) => Number((day - selected + radius) * 100000n / (2n * radius)) / 1000;
  const samples = ends.map(day => rows(day));
  plot.replaceChildren();
  plot.append(textNode("div", "", "cursor"));
  element("list").replaceChildren();
  for (const [i, row] of representations.entries()) {
    const track = textNode("div", "", "track");
    track.setAttribute("aria-hidden", "true");
    const rail = textNode("div", "", "rail");
    for (const [k, day] of ends.entries()) {
      const tick = textNode("span", samples[k]![i]!.label, "tick" + (k === 2 ? " selected" : "") + (k === 0 || k === 4 ? " outer" : ""));
      tick.dataset.day = String(day);
      tick.style.left = percent(day) + "%";
      const mark = textNode("span", "", "mark");
      mark.style.left = tick.style.left;
      rail.append(tick, mark);
    }
    if (ANCHOR >= selected - radius && ANCHOR <= selected + radius) {
      const marker = textNode("div", "", "anchorline");
      if (i === 0) marker.append(textNode("span", "✝"));
      marker.style.left = percent(ANCHOR) + "%";
      rail.append(marker);
    }
    track.append(textNode("strong", row.name), rail);
    plot.append(track);
    const entry = textNode("div", "");
    entry.append(textNode("dt", row.name), textNode("dd", row.label));
    if (i === 4 && (row.note !== "Hong Kong lunisolar calendar") && row.label !== "Outside 1901–2100") {
      entry.append(textNode("small", row.note));
    }
    element("list").append(entry);
  }
  element("basis").textContent = (/month|year|century/.test(scale()) ? "Gregorian steps" : "Step by " + scale()) +
    (selected === ANCHOR ? " · ✝ Sabbath #1" : "");
  if (announce) element("announcement").textContent = heading + ". " + dateLabel;
}

function select(day: AbsoluteDay) {
  selected = day;
  element("error").textContent = "";
  render();
}
element("search").addEventListener("submit", event => {
  event.preventDefault();
  const fields: Record<string,string> = {};
  new FormData(element<HTMLFormElement>("search")).forEach((v,k) => { fields[k] = String(v); });
  try { select(search(modeControl.value as SearchMode, fields)); }
  catch (err) { element("error").textContent = err instanceof Error ? err.message : "Invalid date"; }
});
modeControl.onchange = setupFields;
scaleControl.onchange = () => render(false);
element("today").onclick = () => select(today());
element("anchor").onclick = () => select(ANCHOR);
element("prev").onclick = () => select(step(selected, scale(), -1n));
element("next").onclick = () => select(step(selected, scale(), 1n));
element("before").onclick = () => select(previousStrict(selected));
element("after").onclick = () => select(nextStrict(selected));
plot.onkeydown = event => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  select(step(selected, event.shiftKey ? "week" : "day", event.key === "ArrowLeft" ? -1n : 1n));
};
plot.onclick = event => {
  if (!(event.target instanceof HTMLElement)) return;
  const rail = event.target.closest(".rail");
  if (!rail) return;
  const target = event.target.closest<HTMLElement>("[data-day]")?.dataset.day;
  const bounds = rail.getBoundingClientRect();
  select(target ? absoluteDay(BigInt(target)) : dayAtPixel(selected, radius, bounds.width, event.clientX - bounds.left));
  plot.focus();
};
element("details").onclick = () => {
  const meta = element("metadata");
  meta.replaceChildren(textNode("p", "Julian day number " + selected));
  const data = rows(selected);
  const profiles = [null, hebrew.describe(), julian.describe(), gregorian.describe(), chinese.describe()];
  data.forEach((row,i) => {
    const profile = profiles[i];
    const coverage = profile ? (profile.firstDay === null ? "All integer days" : "1901–2100") + " · " + profile.evidence : "Anchor JDN 1733205";
    meta.append(textNode("p", row.name + " · " + row.label + " · " + row.note + " · " + coverage));
  });
  element("copied").textContent = "";
  dialog.showModal();
};
element("close").onclick = () => dialog.close();
dialog.onclose = () => element("details").focus();
element("copy").onclick = async () => {
  try { await navigator.clipboard.writeText(String(selected)); element("copied").textContent = "JDN copied."; }
  catch { element("copied").textContent = "Select the Julian day number above to copy it."; }
};
setupFields();
render(false);
