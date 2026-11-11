// Exercise only the bytes in the release ZIP, from an isolated loopback origin.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const root = await mkdtemp(join(tmpdir(), "sabbath-release-"));
const server = createServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  try {
    const name = path.endsWith("/") ? path + "index.html" : path;
    const bytes = await readFile(join(root, name));
    const type = name.endsWith(".js") ? "text/javascript" : name.endsWith(".css") ? "text/css" : "text/html";
    response.writeHead(200, { "Content-Type": type }).end(bytes);
  } catch { response.writeHead(404).end(); }
});
let browser;
try {
  execFileSync("python3", ["-m", "zipfile", "-e", "dist/sabbath-calendar-v2.zip", root]);
  for (const file of ["index.html", "css/style.css", "js/calendar.js"]) {
    const baseline = execFileSync("git", ["show", "6229702369afed375cfdbfaa5e6112052d94f57c:" + file]);
    assert.deepEqual(await readFile(join(root, file)), baseline);
  }
  await new Promise((resolve,reject) => server.once("error",reject).listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  browser = await chromium.launch({ channel: "chrome", executablePath: process.env.CHROME_BIN });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, timezoneId: "America/New_York" });
  context.setDefaultTimeout(8000);
  const errors = [];
  const page = await context.newPage();
  page.on("pageerror", err => errors.push(err.message));
  page.on("response", res => { if (res.status() >= 400) errors.push(res.url()); });
  await context.route("**/*", route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    errors.push(route.request().url());
    return route.abort();
  });
  await page.clock.setFixedTime(new Date("2026-04-04T16:00:00Z"));
  await page.goto(origin + "/v2/");
  await page.locator("#headline").filter({ hasText: "#103,991" }).waitFor();
  const readJdn = () => page.locator("#jdn").innerText();
  const find = async index => {
    await page.getByLabel("Number", {exact:true}).fill(index);
    await page.getByRole("button", {name:"Find day"}).click();
  };
  console.log("Desktop loaded; testing offline controls.");
  await context.setOffline(true);
  for (const [mode, year, month, day] of [
    ["julian", "2026", "3", "22"], ["hebrew", "5786", "Nisan", "17"],
    ["chinese", "2026", "2", "17"], ["gregorian", "2026", "4", "4"]
  ]) {
    await page.locator("#mode").selectOption(mode);
    await page.getByLabel(mode === "hebrew" ? "Year (AM)" : "Year", {exact:true}).fill(year);
    await page.getByLabel("Month", {exact:true}).selectOption(month);
    await page.getByLabel("Day", {exact:true}).fill(day);
    await page.getByRole("button", {name:"Find day"}).click();
    assert.equal(await readJdn(), "JDN 2,461,135");
  }
  await page.locator("#mode").selectOption("sabbath");
  await find("-1");
  await page.locator("#after").click();
  assert.equal(await readJdn(), "JDN 1,733,198");
  await page.locator("#plot").press("Shift+ArrowRight");
  assert.equal(await readJdn(), "JDN 1,733,205");
  await page.locator("#plot").press("ArrowLeft");
  assert.equal(await readJdn(), "JDN 1,733,204");
  await find("100000000000000000000");
  await page.locator("#plot").press("ArrowRight");
  assert.equal(await readJdn(), "JDN 700,000,000,000,001,733,199");
  await page.locator("#details").click();
  await page.locator("#dialog").press("Escape");
  assert.equal(await page.locator("#details").evaluate(el => el === document.activeElement), true);
  await page.locator("#mode").selectOption("gregorian");
  await page.getByLabel("Year",{exact:true}).fill("1900");
  await page.getByLabel("Month",{exact:true}).selectOption("2");
  await page.getByLabel("Day",{exact:true}).fill("29");
  await page.getByRole("button",{name:"Find day"}).click();
  assert.match(await page.locator("#error").innerText(), /Day does not exist/);
  assert.equal(await readJdn(), "JDN 700,000,000,000,001,733,199");
  await page.locator("#mode").selectOption("sabbath");
  await page.setViewportSize({width:640,height:450}); // Layout viewport of a 1280px window at 200% zoom.
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({width:320,height:640});
  await find("-1000000");
  assert.equal(await readJdn(), "JDN -5,266,802");
  assert.equal(await page.locator(".track:visible").count(), 1);
  assert.equal(await page.locator("#list dd:visible").count(), 5);
  assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll("main *, header *")]
    .filter(el => el.getBoundingClientRect().right > innerWidth + 1)
    .map(el => el.tagName + "." + el.className + "#" + el.id)), []);
  await page.locator("#today").click();
  assert.match(await page.locator("#list").innerText(), /17 Nisan 5786/);

  console.log("Mobile and keyboard checks passed; exercising distant jumps.");
  const maximumTicks = await page.evaluate(() => {
    const form = document.querySelector("#search");
    const input = form.elements.namedItem("index");
    const scale = document.querySelector("#scale");
    const huge = "1" + "0".repeat(100);
    let maximum = 0;
    for (const option of scale.options) {
      scale.value = option.value;
      scale.dispatchEvent(new Event("change"));
      for (let i = 0; i < 1000; i++) {
        input.value = ["0", huge, "-" + huge][i % 3];
        form.requestSubmit();
        const exact = BigInt(input.value) * 7n + 1733198n;
        const actual = document.querySelector("#jdn").textContent;
        if (actual !== "JDN " + exact.toLocaleString("en-US")) throw new Error("Wrong selection at " + i);
        maximum = Math.max(maximum, document.querySelectorAll(".tick").length);
      }
    }
    return maximum;
  });
  assert.equal(maximumTicks,25);
  console.log("Deep jumps passed; verifying packaged legacy calendar.");
  await context.setOffline(false);
  await page.getByRole("link",{name:"Month calendar"}).click();
  assert.match(await page.locator("#selfCheck").innerText(), /Self-check passed/);
  assert.match(await page.locator("#countdown").innerText(), /Today.*103,991/);
  const anniversary = page.locator('[data-j="2461135"]');
  await anniversary.press("Enter");
  assert.match(await page.locator(".popover").innerText(), /1993rd|1,993rd/);
  await page.keyboard.press("Escape");
  await page.locator("#nextBtn").click();
  assert.match(await page.locator("#calCaption").innerText(), /May/);
  await page.locator("#todayBtn").click();
  assert.match(await page.locator("#calCaption").innerText(), /April/);
  await page.clock.setFixedTime(new Date("2026-04-03T16:00:00Z"));
  await page.reload();
  assert.match(await page.locator("#countdown").innerText(), /tomorrow/);
  await page.locator("#yearInp").fill("33");
  await page.locator("#monthSel").selectOption("3");
  await page.locator("#goBtn").click();
  assert.equal(await page.locator('[data-j="1733198"] .sab-seal.pre').count(),1);
  assert.deepEqual(errors,[]);
  console.log("Packaged release passed in Chrome " + browser.version() + ": offline navigation, mobile layout, dialog focus, 5000 jumps, 25 ticks, legacy parity.");
} finally {
  await browser?.close();
  if (server.listening) await new Promise(resolve => server.close(resolve));
  await rm(root,{recursive:true,force:true});
}
