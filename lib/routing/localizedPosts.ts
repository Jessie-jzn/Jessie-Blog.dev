type LocalizedPost = { category?: string };

export function selectLocalizedPosts<T extends LocalizedPost>(
  posts: T[],
  locale: string,
  categories: [string, string]
): T[] {
  const [enCategory, zhCategory] = categories;
  const category = locale === "en" ? enCategory : zhCategory;
  return posts.filter((post) => post.category === category);
}

export function isLocalePost(post: LocalizedPost, locale: string): boolean {
  const category = String(post.category || "").toLowerCase();
  return locale === "en" ? category.endsWith("-en") : category.endsWith("-zh");
}
