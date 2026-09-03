import type { Post } from '@/lib/type';

const HOME_TRAVEL_POST_LIMIT = 6;

/** Selects the compact travel collection displayed on the home page. */
export function selectTravelPosts(posts: Post[], whvPosts: Post[]): Post[] {
  const travelPosts = posts
    .filter((post) =>
      (post.category || '').toLowerCase().includes('travel'),
    )
    .slice(0, HOME_TRAVEL_POST_LIMIT);

  if (travelPosts.length) return travelPosts;

  const fallbackPosts = posts
    .filter((post) => !whvPosts.some((whvPost) => whvPost.id === post.id))
    .slice(0, HOME_TRAVEL_POST_LIMIT);

  return fallbackPosts.length
    ? fallbackPosts
    : posts.slice(0, HOME_TRAVEL_POST_LIMIT);
}
