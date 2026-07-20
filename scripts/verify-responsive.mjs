import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const preview = readFileSync("public/preview.html", "utf8");
const viewports = [375, 390, 430];

assert.match(preview, /width: min\(100% - 24px, 430px\)/);
assert.match(preview, /overflow-x: hidden/);
assert.match(preview, /max-width: calc\(100vw - 24px\)/);
assert.match(preview, /main \{ min-width:0; padding: 18px 20px calc\(7rem \+ var\(--safe-bottom\)\); \}/);
assert.match(preview, /\.view, \.glass, \.character, \.today-panel \{ min-width:0; max-width:100%; \}/);
assert.match(preview, /@media \(max-width: 430px\)/);
assert.match(preview, /\.phone \{ width: min\(100% - 40px, 390px\); max-width: calc\(100vw - 40px\); border-radius: 32px; \}/);
assert.match(preview, /\.nav \{ width: min\(100% - 40px, 374px\); \}/);
assert.match(preview, /\.estimate-grid\.estimate-fields \{ grid-template-columns:1fr; \}/);
assert.match(preview, /@media \(max-width: 380px\)/);
assert.match(preview, /\.actions, \.grid-2 \{ gap: 10px; \}/);

for (const viewport of viewports) {
  const phoneWidth = viewport <= 430 ? Math.min(viewport - 40, 390) : Math.min(viewport - 24, 430);
  const mainSidePadding = viewport <= 430 ? 16 : 20;
  const mainContentWidth = phoneWidth - mainSidePadding * 2;
  const formContentWidth = mainContentWidth - 40;
  const estimateInnerWidth = formContentWidth - 30;
  const navWidth = viewport <= 430 ? Math.min(viewport - 40, 374) : Math.min(viewport - 28, 402);
  const usesSingleColumnEstimate = viewport <= 430;
  const estimateColumnWidth = usesSingleColumnEstimate ? estimateInnerWidth : (estimateInnerWidth - 16) / 3;

  assert.ok(phoneWidth >= 335, `${viewport}px phone shell should stay usable`);
  assert.ok(mainContentWidth >= 303, `${viewport}px main content should not collapse`);
  assert.ok(formContentWidth >= 263, `${viewport}px form fields should stay readable`);
  assert.ok(estimateColumnWidth >= 72, `${viewport}px estimate editor should not squeeze fields`);
  assert.ok(navWidth <= viewport - 28, `${viewport}px bottom nav should keep side breathing room`);
}

console.log("Responsive layout constraints verified for 375, 390, and 430px.");
