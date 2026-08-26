import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import SiteConfig from "../../site.config.ts";

const require = createRequire(import.meta.url);
const nextConfig = require("../../next.config.js");

test("uses the deployed www origin without a canonical redirect", () => {
  assert.equal(SiteConfig.siteUrl, "https://www.jessieonroad.com");
  assert.equal(
    SiteConfig.imageProxyUrl,
    "https://www.jessieonroad.com/api/image-proxy/"
  );
});

test("keeps Next image optimization enabled", () => {
  assert.notEqual(nextConfig.images?.unoptimized, true);
});
