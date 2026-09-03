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

test('returns compact related article cards without unused Notion metadata', () => {
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
