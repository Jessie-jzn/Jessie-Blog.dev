import assert from "node:assert/strict";
import test from "node:test";

import { preserveArticlePageOnTransientFailure } from "../../lib/routing/articlePageFailure.ts";

test("throws transient upstream failures so ISR keeps the last valid article", () => {
  const failure = new Error("Notion timed out");

  assert.throws(
    () => preserveArticlePageOnTransientFailure(failure),
    (error) => error === failure
  );
});

test("normalizes non-Error failures before they reach Next.js", () => {
  assert.throws(
    () => preserveArticlePageOnTransientFailure("Notion timed out"),
    /Failed to generate article page/
  );
});
