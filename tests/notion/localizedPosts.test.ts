import assert from "node:assert/strict";
import test from "node:test";

import { selectLocalizedPosts } from "../../lib/routing/localizedPosts.ts";

const posts = [
  { id: "en", category: "travel-en" },
  { id: "zh", category: "travel-zh" },
];

test("returns only posts for the selected language category", () => {
  assert.deepEqual(
    selectLocalizedPosts(posts, "en", ["travel-en", "travel-zh"]),
    [posts[0]]
  );
  assert.deepEqual(
    selectLocalizedPosts(posts, "zh", ["travel-en", "travel-zh"]),
    [posts[1]]
  );
});
