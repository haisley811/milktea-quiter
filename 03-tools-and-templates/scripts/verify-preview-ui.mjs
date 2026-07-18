import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("public/preview.html", "utf8");

function countMatches(pattern) {
  return [...html.matchAll(pattern)].length;
}

const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
assert.ok(scriptMatch, "preview.html should contain an inline script");
new Function(scriptMatch[1]);

[
  "soft",
  "mono",
  "liquid",
  "y2k",
  "neo",
  "cyber"
].forEach((theme) => {
  assert.match(html, new RegExp(`key:"${theme}"`), `${theme} should be present in UI_THEMES`);
  assert.match(html, new RegExp(`data-ui-theme="${theme}"`), `${theme} should have CSS overrides`);
  assert.match(html, new RegExp(`theme-swatch\\.${theme}|theme-swatch ${theme}`), `${theme} should have a swatch`);
});

assert.equal(countMatches(/key:"(?:soft|mono|liquid|y2k|neo|cyber)"/g), 6, "preview should expose exactly six UI themes");
assert.match(html, /const KEY_UI = "milkTeaUiPreferences"/);
assert.match(html, /loadUiPreferences/);
assert.match(html, /saveUiPreferences/);
assert.match(html, /applyUiShell/);
assert.match(html, /themeControlsHtml/);
assert.match(html, /data-theme-choice/);
assert.match(html, /data-show-character/);
assert.match(html, /showCharacter/);
assert.match(html, /applyUiPreferencesToPreview/);
assert.match(html, /renderWithUiPreferences/);
assert.match(html, /MutationObserver\(syncResultModalCharacterText\)/);
assert.match(html, /#home-character/);
assert.match(html, /#record-character/);
assert.match(html, /#data-character/);
assert.match(html, /#data-score-meter/);
assert.match(html, /#stage-progress/);
assert.match(html, /Body Score/);
assert.match(html, /人物展示已隐藏/);
assert.match(html, /人物展示已开启/);

console.log("Preview UI preferences verified.");
