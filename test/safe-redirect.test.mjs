import test from "node:test";
import assert from "node:assert/strict";

import { safeNextPath } from "../src/lib/safe-redirect.mjs";

const fallback = "/app/profile/edit";

test("keeps same-origin paths and rejects external redirect targets", () => {
  assert.equal(safeNextPath("/auth/reset-password?token=abc#form"), "/auth/reset-password?token=abc#form");
  assert.equal(safeNextPath("https://evil.example.com", fallback), fallback);
  assert.equal(safeNextPath("//evil.example.com", fallback), fallback);
  assert.equal(safeNextPath("/\\evil.example.com", fallback), fallback);
  assert.equal(safeNextPath("javascript:alert(1)", fallback), fallback);
  assert.equal(safeNextPath("data:text/html,<script>alert(1)</script>", fallback), fallback);
  assert.equal(safeNextPath("ftp://evil.example.com", fallback), fallback);
  assert.equal(safeNextPath("app/profile/edit", fallback), fallback);
  assert.equal(safeNextPath(null, fallback), fallback);
});
