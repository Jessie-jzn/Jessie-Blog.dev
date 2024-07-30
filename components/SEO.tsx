import Head from 'next/head';
import SiteConfig from '../site.config';
import * as Config from '@/lib/config';
import { useRouter } from 'next/router';
interface CommonSEOProps {
  title?: string;
  description?: string;
  image: string | null;
  ogType?: string;
}
export const CommonSEO = ({
  title,
  description,
  image,
  ogType = 'website',
}: CommonSEOProps) => {
  const router = useRouter();
  const rssFeedUrl = `${Config.host}/feed`;
  // 如果没有提供 title 和 description，则使用站点的默认名称和描述
  title = title ?? SiteConfig?.title;
  description = description ?? SiteConfig?.description;

  const socialImageUrl = image;
  const url = `${SiteConfig.siteUrl}${router.asPath}`;

  // const socialImageUrl = getSocialImageUrl(pageId) || image;

  return (
    <Head>
      {/* 设置字符编码 */}
      <meta charSet="utf-8" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* 设置 viewport 以支持响应式设计 */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
      {/* 配置 Apple 移动设备的相关元数据 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/* 根据系统的主题颜色模式配置主题色 */}
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fefffe"
        key="theme-color-light"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#2d3439"
        key="theme-color-dark"
      />

      {/* 配置搜索引擎索引和跟随策略 */}
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content={ogType} />

      {/* 如果有描述信息，则配置相关的 meta 标签 */}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {/* 配置页面标题的相关 meta 标签 */}
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <title>{title}</title>
      <meta
        name="keywords"
        content="travel, blog, Jessie, travel blogger, travel tips, travel stories"
      />

      {/* 配置社交媒体分享图片的相关 meta 标签 */}
      {socialImageUrl ? (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={socialImageUrl} />
          <meta property="og:image" content={socialImageUrl} />
        </>
      ) : (
        <meta name="twitter:card" content="summary" />
      )}

      {/* 配置页面的 URL */}

      <>
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:site" content={SiteConfig.twitter} />
      </>

      {/* 配置 RSS feed 的链接 */}
      <link
        rel="alternate"
        type="application/rss+xml"
        href={rssFeedUrl}
        title={SiteConfig?.title}
      />

      {/* 谷歌广告 */}
      <meta
        name="google-adsense-account"
        content="ca-pub-9533100025276131"
      ></meta>
    </Head>
  );
};

interface BlogSeoProps extends CommonSEOProps {
  // url: string;
  createdTime: string | Date;
  lastEditTime: string | Date;
}

export const BlogSEO = ({
  title,
  createdTime,
  lastEditTime,

  // url,
  image,
}: BlogSeoProps) => {
  const router = useRouter();

  const publishedAt = new Date(createdTime).toISOString();
  const modifiedAt = new Date(lastEditTime).toISOString();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SiteConfig.siteUrl}${router.asPath}`,
    },
    headline: title,
    image: image,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      '@type': 'Person',
      name: SiteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SiteConfig.author,
      logo: {
        '@type': 'ImageObject',
        url: `${SiteConfig.siteUrl}${SiteConfig.siteLogo}`,
      },
    },
    description: SiteConfig.description,
  };

  return (
    <>
      <CommonSEO title={title} ogType="article" image={image} />
      <Head>
        {/* {date && (
          <meta property="article:published_time" content={publishedAt} />
        )}
        {lastEdit && (
          <meta property="article:modified_time" content={modifiedAt} />
        )} */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
