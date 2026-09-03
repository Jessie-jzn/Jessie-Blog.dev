import assert from 'node:assert/strict';
import test from 'node:test';

import { stripRecordMapRaw } from '../../lib/notion/stripRecordMapRaw.ts';

test('removes the unused raw Notion response while preserving render data', () => {
  const recordMap = {
    block: { page: { value: { id: 'page' } } },
    collection: {},
    raw: { large: 'upstream response' },
  };

  assert.deepEqual(stripRecordMapRaw(recordMap), {
    block: { page: { value: { id: 'page' } } },
    collection: {},
  });
  assert.deepEqual(recordMap.raw, { large: 'upstream response' });
});
