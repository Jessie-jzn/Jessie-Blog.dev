import assert from 'node:assert/strict';
import test from 'node:test';

import { retryableNotFound } from '../../lib/routing/retryableNotFound.ts';

test('marks an upstream-dependent 404 for prompt regeneration', () => {
  assert.deepEqual(retryableNotFound(), {
    notFound: true,
    revalidate: 60,
  });
});
