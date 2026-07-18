import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public");
const html = readFileSync(join(root, "preview.html"), "utf8");

assert.match(html, /今天不喝/);
assert.match(html, /images\/girl-stage-\$\{currentStage\}-transparent\.png/);
assert.match(html, /data-delete/);
assert.match(html, /个人账号与同步/);
assert.match(html, /http:\/\/127\.0\.0\.1:4173\/api\/estimate-drink/);
assert.doesNotMatch(html, /127\.0\.0\.1:4180/);

for (const imageName of [
  "girl-stage-1-transparent.png",
  "girl-stage-2-transparent.png",
  "girl-stage-3-transparent.png",
  "girl-stage-4-transparent.png",
  "girl-stage-5-transparent.png",
]) {
  const bytes = readFileSync(join(root, "images", imageName));
  assert.equal(bytes[0], 0x89, `${imageName} should be a PNG file`);
  assert.equal(bytes[1], 0x50, `${imageName} should be a PNG file`);
  assert.equal(bytes[2], 0x4e, `${imageName} should be a PNG file`);
  assert.equal(bytes[3], 0x47, `${imageName} should be a PNG file`);
}

console.log("Preview static smoke test passed.");
