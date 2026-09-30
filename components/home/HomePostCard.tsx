/** 首页专用文章卡片，复用封面容错与规范文章路由。 */
import Link from 'next/link';
import ArticleImage from '@/components/ArticleImage';
import { canonicalArticlePath } from '@/lib/routing/articleRoute';
import type { Post } from '@/lib/type';

export default function HomePostCard({ post, variant = 'card' }: {
  post: Post;
  variant?: 'card' | 'feature' | 'compact' | 'photo';
}) {
  const image = post.pageCoverThumbnail || post.pageCover;
  const date = post.publishDay || post.lastEditedDay || post.lastEditedDate;
  const isPhoto = variant === 'photo';
  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';

  return (
    <Link href={canonicalArticlePath(post)} prefetch={false} className='editorial-focus group block h-full rounded-xl'>
      <article className={`relative flex h-full overflow-hidden rounded-xl border border-line ${isPhoto ? 'min-h-60 bg-muted' : 'bg-muted'} ${isFeature ? 'flex-col md:flex-row' : isCompact ? 'flex-row items-center' : 'flex-col'}`}>
        <div className={`shrink-0 overflow-hidden bg-muted ${isPhoto ? 'absolute inset-0' : isFeature ? 'relative aspect-[16/10] md:aspect-auto md:w-1/2' : isCompact ? 'relative m-3 h-20 w-20 rounded-lg' : 'relative m-3 mb-0 aspect-[16/9] rounded-lg'}`}>
          <ArticleImage src={image} alt='' fill sizes={isCompact ? '80px' : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 544px'} className='object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]' />
        </div>
        {isPhoto ? <div aria-hidden='true' className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' /> : null}
        <div className={`relative z-10 flex flex-1 flex-col ${isPhoto ? 'justify-end p-5 text-white' : isFeature ? 'justify-center p-6 text-ink sm:p-8' : isCompact ? 'min-w-0 py-3 pr-3 text-ink' : 'p-4 text-ink'}`}>
          {!isPhoto && !isCompact && post.category ? <p className='mb-3 w-fit rounded bg-primarySoft px-2 py-1 text-[10px] text-primaryStrong'>{post.category}</p> : null}
          <h3 className={`line-clamp-2 font-medium leading-relaxed tracking-tight transition-colors ${isFeature ? 'text-xl sm:text-2xl' : isCompact ? 'text-sm' : 'text-base'} ${isPhoto ? '' : 'group-hover:text-primaryStrong'}`}>{post.title}</h3>
          {post.summarize ? <p className={`mt-2 line-clamp-2 text-xs leading-6 ${isPhoto ? 'text-white/80' : 'text-subtle'}`}>{post.summarize}</p> : null}
          {date ? <time className={`mt-3 text-[10px] ${isPhoto ? 'text-white/75' : 'text-subtle'}`}>{date}</time> : null}
        </div>
      </article>
    </Link>
  );
}
