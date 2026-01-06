import { Post } from '@/lib/type';
import SiteConfig from '@/site.config';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

export function generateSitemapXML(posts: Post[]): string {
  const urls: SitemapURL[] = [
    // 主页
    {
      loc: `${SiteConfig.siteUrl}`,
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    // 固定页面
    {
      loc: `${SiteConfig.siteUrl}/about`,
      changefreq: 'monthly' as const,
      priority: 0.8,
    },
    {
      loc: `${SiteConfig.siteUrl}/travel`,
      changefreq: 'weekly' as const,
      priority: 0.9,
    },
    {
      loc: `${SiteConfig.siteUrl}/technical`,
      changefreq: 'weekly' as const,
      priority: 0.9,
    },
    // 博客文章
    ...posts.map(
      (post): SitemapURL => ({
        loc: `${SiteConfig.siteUrl}/post/${post.id}`,
        lastmod: post.lastEditedDate,
        changefreq: 'monthly' as const,
        priority: 0.7,
      })
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    )
    .join('')}
</urlset>`;

  return sitemap;
}
