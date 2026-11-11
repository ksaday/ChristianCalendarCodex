import test from "node:test";
import assert from "node:assert/strict";
import { dayAtPixel, rows, search, step } from "../dist/timeline.js";

const civil = (year,month,day,era="CE") => search("gregorian",{year,month,day,era});
test("all five search modes synchronize to an absolute day", () => {
  const d = civil("2026","4","4");
  assert.equal(search("sabbath",{index:"103991"}),d);
  assert.equal(search("julian",{year:"2026",month:"3",day:"22",era:"CE"}),d);
  assert.equal(search("hebrew",{year:"5786",month:"Nisan",day:"17"}),d);
  assert.equal(search("chinese",{year:"2026",month:"2",day:"17",kind:"regular"}),d);
  assert.equal(rows(d).length,5);
  assert.throws(()=>civil("1900","2","29"));
  assert.throws(()=>civil("2026","4","1e1"));
});
test("Gregorian navigation clamps short months and crosses the era boundary", () => {
  assert.equal(step(civil("2024","1","31"),"month",1n),civil("2024","2","29"));
  assert.equal(step(civil("2000","2","29"),"century",1n),civil("2100","2","28"));
  assert.equal(step(civil("1","12","1","BCE"),"month",1n),civil("1","1","1"));
});
test("deep jumps retain pixel and keyboard precision", () => {
  for (const index of ["-1","0","-1000000","1"+"0".repeat(100)]) {
    const d = search("sabbath",{index});
    assert.equal(step(d,"week",-1n),d-7n);
    assert.equal(step(d,"day",1n),d+1n);
    assert.equal(dayAtPixel(d,50n,100,51),d+1n);
    assert.equal(dayAtPixel(d,50n,100,-1),d-50n);
    assert.equal(rows(d)[1].label,"Outside 1901–2100");
  }
});
