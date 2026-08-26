import assert from 'node:assert/strict';
import test from 'node:test';

import type { Post } from '../../lib/type.ts';

const post = (id: string, category: string): Post => ({
  id,
  title: id,
  category,
  tags: [],
  pageCover: '',
  pageCoverThumbnail: '',
});

const loadSelector = async () => {
  const module = await import('../../lib/home/selectTechnicalPosts.ts').catch(
    () => ({ selectTechnicalPosts: (_posts: Post[]) => [] as Post[] }),
  );

  return module.selectTechnicalPosts;
};

test('selects the first six localized technical articles in source order', async () => {
  const selectTechnicalPosts = await loadSelector();
  const posts = [
    post('travel', 'travel'),
    post('tech-1', 'technical-zh'),
    post('tech-2', 'technical-en'),
    post('tech-3', 'Technical-ZH'),
    post('unrelated', 'technical-notes'),
    post('tech-4', 'technical-en'),
    post('tech-5', 'technical-zh'),
    post('tech-6', 'technical-en'),
    post('tech-7', 'technical-zh'),
  ];

  assert.deepEqual(
    selectTechnicalPosts(posts).map(({ id }) => id),
    ['tech-1', 'tech-2', 'tech-3', 'tech-4', 'tech-5', 'tech-6'],
  );
});

test('returns an empty collection when no localized technical articles exist', async () => {
  const selectTechnicalPosts = await loadSelector();

  assert.deepEqual(selectTechnicalPosts([post('travel', 'travel')]), []);
});
