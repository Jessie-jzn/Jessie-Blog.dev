import assert from 'node:assert/strict';
import test from 'node:test';

import { createIntentPrefetch } from '../../lib/routing/intentPrefetch.ts';

test('prefetches an article route once after the user signals intent', async () => {
  const requestedRoutes: string[] = [];
  const prefetch = async (href: string) => {
    requestedRoutes.push(href);
  };
  const prefetchOnIntent = createIntentPrefetch(
    prefetch,
    '/technical-zh/example-article/',
  );

  prefetchOnIntent();
  prefetchOnIntent();
  await Promise.resolve();

  assert.deepEqual(requestedRoutes, ['/technical-zh/example-article/']);
});
