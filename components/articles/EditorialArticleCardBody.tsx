/** 按多种版式渲染文章封面、元数据和链接的编辑式卡片主体。 */
import Link from "next/link";
import ArticleImage from "@/components/ArticleImage";
import type { Post } from "@/lib/type";

export type EditorialArticleCardVariant =
  | "row"
  | "feature"
  | "compact"
  | "lead"
  | "index";

interface EditorialArticleCardBodyProps {
  article: Post;
  variant: EditorialArticleCardVariant;
  priority: boolean;
  href: string;
  position?: number;
}

type EditorialArticleCardVariantProps = Omit<
  EditorialArticleCardBodyProps,
  "variant"
>;

const articleImageSource = (article: Post) =>
  article.pageCoverThumbnail || article.pageCover;

const ArticleMeta = ({ article }: { article: Post }) => {
  const date = article.publishDay || article.lastEditedDate;

  if (!date && !article.category) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
      {article.category ? <span className="capitalize">{article.category}</span> : null}
      {article.category && date ? <span aria-hidden="true">•</span> : null}
      {date ? <time>{date}</time> : null}
    </div>
  );
};

const ArticleTags = ({ tags }: { tags: string[] }) => {
  if (!tags.length) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Article tags">
      {tags.slice(0, 3).map((tag) => (
        <li key={tag} className="editorial-tag rounded-full px-2.5 py-1 text-xs font-medium">
          {tag}
        </li>
      ))}
    </ul>
  );
};

const RowCard = ({ article, priority, href }: EditorialArticleCardVariantProps) => (
  <Link
    href={href}
    prefetch={false}
    className="editorial-focus group block rounded-2xl"
  >
    <article className="editorial-card flex flex-col overflow-hidden transition-shadow duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg md:flex-row">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted md:w-5/12">
        <ArticleImage
          src={articleImageSource(article)}
          alt={article.title}
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 1152px) 42vw, 29rem"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6">
        <ArticleMeta article={article} />
        <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-2xl">
          {article.title}
        </h2>
        {article.summarize ? (
          <p className="line-clamp-3 text-sm leading-6 text-subtle sm:text-base">
            {article.summarize}
          </p>
        ) : null}
        <div className="mt-auto pt-1">
          <ArticleTags tags={article.tags || []} />
        </div>
      </div>
    </article>
  </Link>
);

const FeatureCard = ({ article, priority, href }: EditorialArticleCardVariantProps) => (
  <Link
    href={href}
    prefetch={false}
    className="editorial-focus group block h-full rounded-2xl"
  >
    <article className="editorial-card flex h-full flex-col overflow-hidden transition-shadow duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ArticleImage
          src={articleImageSource(article)}
          alt={article.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <ArticleMeta article={article} />
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">
          {article.title}
        </h2>
        {article.summarize ? (
          <p className="line-clamp-3 text-sm leading-6 text-subtle">{article.summarize}</p>
        ) : null}
        <div className="mt-auto pt-1">
          <ArticleTags tags={article.tags || []} />
        </div>
      </div>
    </article>
  </Link>
);

const CompactCard = ({ article, priority, href }: EditorialArticleCardVariantProps) => (
  <Link
    href={href}
    prefetch={false}
    className="editorial-focus group block rounded-2xl"
  >
    <article className="editorial-card flex gap-4 p-4 transition-shadow duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-md">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-36">
        <ArticleImage
          src={articleImageSource(article)}
          alt={article.title}
          fill
          priority={priority}
          sizes="144px"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em] text-ink">
          {article.title}
        </h2>
        {article.summarize ? (
          <p className="line-clamp-2 text-sm leading-5 text-subtle">{article.summarize}</p>
        ) : null}
        <div className="mt-auto">
          <ArticleMeta article={article} />
        </div>
      </div>
    </article>
  </Link>
);

const LeadArticle = ({ article, priority, href }: EditorialArticleCardVariantProps) => (
  <Link href={href} prefetch={false} className="editorial-focus group block">
    <article>
      <div className="relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[3/2]">
        <ArticleImage
          src={articleImageSource(article)}
          alt={article.title}
          fill
          priority={priority}
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:mt-6">
        <ArticleMeta article={article} />
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-3xl lg:text-4xl">
          {article.title}
        </h3>
        {article.summarize ? (
          <p className="line-clamp-3 max-w-2xl text-sm leading-6 text-subtle sm:text-base sm:leading-7">
            {article.summarize}
          </p>
        ) : null}
      </div>
    </article>
  </Link>
);

const IndexArticle = ({
  article,
  priority,
  href,
  position = 1,
}: EditorialArticleCardVariantProps) => {
  const image = articleImageSource(article);

  return (
    <Link href={href} prefetch={false} className="editorial-focus group block py-5">
      <article className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_7.5rem] sm:items-center">
        <span
          aria-hidden="true"
          className="pt-0.5 text-xs font-medium tabular-nums tracking-[0.12em] text-primaryStrong sm:self-start"
        >
          {String(position).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <ArticleMeta article={article} />
          <h3 className="mt-2 text-base font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-primaryStrong sm:text-lg">
            {article.title}
          </h3>
        </div>
        {image ? (
          <div className="relative hidden aspect-[4/3] overflow-hidden bg-muted sm:block">
            <ArticleImage
              src={image}
              alt=""
              fill
              priority={priority}
              sizes="120px"
              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
      </article>
    </Link>
  );
};

const EditorialArticleCardBody = ({
  article,
  variant,
  priority,
  href,
  position,
}: EditorialArticleCardBodyProps) => {
  if (variant === "lead") {
    return <LeadArticle article={article} priority={priority} href={href} />;
  }

  if (variant === "index") {
    return (
      <IndexArticle
        article={article}
        priority={priority}
        href={href}
        position={position}
      />
    );
  }

  if (variant === "feature") {
    return <FeatureCard article={article} priority={priority} href={href} />;
  }

  if (variant === "compact") {
    return <CompactCard article={article} priority={priority} href={href} />;
  }

  return <RowCard article={article} priority={priority} href={href} />;
};

export default EditorialArticleCardBody;
