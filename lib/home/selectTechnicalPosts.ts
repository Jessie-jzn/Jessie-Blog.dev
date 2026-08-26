import type { Post } from '@/lib/type';

const TECHNICAL_CATEGORIES = new Set(['technical-en', 'technical-zh']);

export const selectTechnicalPosts = (posts: Post[]): Post[] =>
  posts
    .filter((post) =>
      TECHNICAL_CATEGORIES.has((post.category || '').toLowerCase()),
    )
    .slice(0, 6);
