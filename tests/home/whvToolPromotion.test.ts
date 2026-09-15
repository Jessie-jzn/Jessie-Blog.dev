import assert from 'node:assert/strict';
import test from 'node:test';

import { isWhvJobPost, WHV_TOOL_URL } from '../../lib/home/whvToolPromotion.ts';

test('recognizes WHV job-search posts from their category or tags', () => {
  assert.equal(
    isWhvJobPost({
      category: 'whv-zh',
      tags: ['签证'],
    }),
    true,
  );
  assert.equal(
    isWhvJobPost({
      category: 'travel',
      tags: ['462', '找工作'],
    }),
    true,
  );
  assert.equal(
    isWhvJobPost({ category: 'travel', tags: ['墨尔本'] }), false);
});

test('uses the canonical 462 postcode tool URL', () => {
  assert.equal(WHV_TOOL_URL, 'https://www.jessieonroad.com/whv-ai-copilot/');
});
