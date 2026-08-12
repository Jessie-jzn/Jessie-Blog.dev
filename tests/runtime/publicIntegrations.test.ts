import assert from "node:assert/strict";
import test from "node:test";

import { getPublicIntegrations } from "../../lib/runtime/publicIntegrations.ts";

test("disables missing and malformed optional integrations", () => {
  assert.deepEqual(
    getPublicIntegrations({
      NEXT_PUBLIC_GA_ID: " ",
      NEXT_PUBLIC_ADSENSE_ID: "undefined",
      NEXT_PUBLIC_CLARITY_ID: undefined,
      NEXT_PUBLIC_CUSTOM_SCRIPT_URL: "/undefined/",
    }),
    {
      gaId: null,
      adsenseId: null,
      clarityId: null,
      customScriptUrl: null,
    }
  );
});

test("keeps configured integrations and an absolute HTTPS custom script", () => {
  assert.deepEqual(
    getPublicIntegrations({
      NEXT_PUBLIC_GA_ID: "G-ABC123",
      NEXT_PUBLIC_ADSENSE_ID: "ca-pub-123",
      NEXT_PUBLIC_CLARITY_ID: "clarity-123",
      NEXT_PUBLIC_CUSTOM_SCRIPT_URL: "https://example.com/script.js",
    }),
    {
      gaId: "G-ABC123",
      adsenseId: "ca-pub-123",
      clarityId: "clarity-123",
      customScriptUrl: "https://example.com/script.js",
    }
  );
});

test("accepts HTTP custom scripts for local development", () => {
  assert.equal(
    getPublicIntegrations({
      NEXT_PUBLIC_CUSTOM_SCRIPT_URL: "http://127.0.0.1:4000/script.js",
    }).customScriptUrl,
    "http://127.0.0.1:4000/script.js"
  );
});
