import assert from 'node:assert/strict';
import test from 'node:test';

import { getRelatedPosts } from '../../lib/services/RelatedPostsService.ts';
import type { Post } from '../../lib/type.ts';

const post = (id: string, tags: string[], ext?: Record<string, unknown>): Post => ({
  id,
  title: id,
  tags,
  category: 'whv-zh',
  summarize: `${id} summary`,
  pageCover: 'https://example.com/cover.jpg',
  pageCoverThumbnail: 'https://example.com/thumb.jpg',
  slug: `${id}-slug`,
  ext,
});

test('returns compact related article data without unused Notion metadata', () => {
  const current = post('current', ['Australia']);
  const related = post('related', ['Australia'], { raw: 'large metadata' });

  assert.deepEqual(getRelatedPosts(current.id, [current, related]), [
    {
      id: 'related',
      title: 'related',
      tags: ['Australia'],
      category: 'whv-zh',
      summarize: 'related summary',
      publishDate: 0,
      publishDay: '',
      lastEditedDate: '',
      lastEditedDay: '',
      pageCover: 'https://example.com/cover.jpg',
      pageCoverThumbnail: 'https://example.com/thumb.jpg',
      slug: 'related-slug',
    },
  ]);
});

test('returns up to ten related posts in their database order', () => {
  const current = post('current', ['Australia']);
  const related = Array.from({ length: 12 }, (_, index) =>
    post(`related-${index + 1}`, ['Australia']),
  );

  const result = getRelatedPosts(current.id, [current, ...related]);

  assert.equal(result.length, 10);
  assert.deepEqual(
    result.map(({ id }) => id),
    [
      'related-1',
      'related-2',
      'related-3',
      'related-4',
      'related-5',
      'related-6',
      'related-7',
      'related-8',
      'related-9',
      'related-10',
    ],
  );
});
