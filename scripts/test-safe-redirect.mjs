import assert from "node:assert/strict";
import { getSafeCallbackUrl } from "../lib/safeRedirect.js";

const allowed = [
  ["/my-list", "/my-list"],
  ["/movie/603?x=1", "/movie/603?x=1"],
];

const rejected = [
  "//evil.com",
  "/\\evil.com",
  "/%5Cevil.com",
  "/%2F%2Fevil.com",
  "/..//evil.com",
  "/%2e%2e//evil.com",
  "/%252e%252e//evil.com",
  "https://evil.com",
  "javascript:alert(1)",
  "/\t/evil.com",
  "",
  "null",
  "/login",
];

for (const [input, expected] of allowed) {
  assert.equal(getSafeCallbackUrl(input), expected);
  console.log(`ALLOWED: ${input} -> ${expected}`);
}

for (const input of rejected) {
  assert.equal(getSafeCallbackUrl(input, "/"), "/");
  console.log(`REJECTED: ${JSON.stringify(input)} -> /`);
}
