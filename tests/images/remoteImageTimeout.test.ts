import assert from "node:assert/strict";
import test from "node:test";
import { createResponseTimeout } from "../../lib/images/remoteImageTimeout.ts";

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

test("keeps a received image response alive after its connection timeout is cleared", async () => {
  const timeout = createResponseTimeout(5);
  let aborted = false;
  timeout.signal.addEventListener("abort", () => {
    aborted = true;
  });

  timeout.clear();
  await wait(15);

  assert.equal(aborted, false);
});

test("aborts an image request that never receives a response", async () => {
  const timeout = createResponseTimeout(5);
  let aborted = false;
  timeout.signal.addEventListener("abort", () => {
    aborted = true;
  });

  await wait(15);

  assert.equal(aborted, true);
});
