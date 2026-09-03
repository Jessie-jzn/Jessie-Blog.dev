import assert from 'node:assert/strict';
import test from 'node:test';

import { selectTravelPosts } from '../../lib/home/selectTravelPosts.ts';
import type { Post } from '../../lib/type.ts';

const post = (id: string, category: string): Post => ({
  id,
  title: id,
  category,
  tags: [],
  pageCover: '',
  pageCoverThumbnail: '',
});

test('selects at most six travel articles for the home page', () => {
  const posts = Array.from({ length: 8 }, (_, index) =>
    post(`travel-${index + 1}`, 'travel-zh'),
  );

  assert.deepEqual(
    selectTravelPosts(posts, []).map(({ id }) => id),
    ['travel-1', 'travel-2', 'travel-3', 'travel-4', 'travel-5', 'travel-6'],
  );
});
