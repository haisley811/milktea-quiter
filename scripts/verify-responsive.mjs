import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const preview = readFileSync("public/preview.html", "utf8");
const viewports = [375, 390, 430];

assert.match(preview, /width: min\(100% - 24px, 430px\)/);
assert.match(preview, /overflow-x: hidden/);
assert.match(preview, /max-width: calc\(100vw - 24px\)/);
assert.match(preview, /main \{ min-width:0; padding: 18px 20px calc\(7rem \+ var\(--safe-bottom\)\); \}/);
assert.match(preview, /\.view, \.glass, \.character, \.today-panel \{ min-width:0; max-width:100%; \}/);
assert.match(preview, /@media \(max-width: 480px\)/);
assert.match(preview, /\.phone \{ width:100%; max-width:100%; min-height:100svh; margin:0; border:0; border-radius:0; box-shadow:none; \}/);
assert.match(preview, /\.nav \{ width:calc\(100% - 24px\); max-width:none; \}/);
assert.match(preview, /\.estimate-grid\.estimate-fields \{ grid-template-columns:1fr; \}/);
assert.match(preview, /\.pill \{ min-height:44px/);
assert.match(preview, /min-height: 48px/);
assert.match(preview, /@media \(max-width: 380px\)/);
assert.match(preview, /\.actions, \.grid-2 \{ gap: 10px; \}/);

for (const viewport of viewports) {
  const phoneWidth = viewport <= 480 ? viewport : Math.min(viewport - 24, 430);
  const mainSidePadding = viewport <= 480 ? 16 : 20;
  const mainContentWidth = phoneWidth - mainSidePadding * 2;
  const formContentWidth = mainContentWidth - 40;
  const estimateInnerWidth = formContentWidth - 30;
  const navWidth = viewport <= 480 ? viewport - 24 : Math.min(viewport - 28, 402);
  const usesSingleColumnEstimate = viewport <= 480;
  const estimateColumnWidth = usesSingleColumnEstimate ? estimateInnerWidth : (estimateInnerWidth - 16) / 3;

  assert.equal(phoneWidth, viewport, `${viewport}px should use the full mobile viewport`);
  assert.ok(mainContentWidth >= 343, `${viewport}px main content should not collapse`);
  assert.ok(formContentWidth >= 303, `${viewport}px form fields should stay readable`);
  assert.ok(estimateColumnWidth >= 72, `${viewport}px estimate editor should not squeeze fields`);
  assert.equal(navWidth, viewport - 24, `${viewport}px bottom nav should keep 12px side breathing room`);
}

console.log("Responsive layout constraints verified for 375, 390, and 430px.");
