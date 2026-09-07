import assert from "node:assert/strict";
import test from "node:test";

import { retryNotionPageLoad } from "../../lib/notion/retryNotionPageLoad.ts";

test("retries one transient page-load failure before returning an error", async () => {
  let attempts = 0;

  const result = await retryNotionPageLoad(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error("temporary Notion failure");
    return "record-map";
  });

  assert.equal(result, "record-map");
  assert.equal(attempts, 2);
});

test("survives two consecutive transient failures during a cold page build", async () => {
  let attempts = 0;

  const result = await retryNotionPageLoad(async () => {
    attempts += 1;
    if (attempts < 3) {
      throw new Error("temporary Notion failure");
    }
    return "page";
  });

  assert.equal(result, "page");
  assert.equal(attempts, 3);
});
