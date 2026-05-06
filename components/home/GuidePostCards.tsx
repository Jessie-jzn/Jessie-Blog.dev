import Link from 'next/link';
import Image from 'next/image';

interface GuidePost {
  id: string;
  title: string;
  pageCoverThumbnail: string;
  summarize?: string;
  lastEditedDate?: string;
  tags?: string[];
}

const GuidePostCards = ({ posts }: { posts: GuidePost[] }) => {
  if (!posts?.length) return null;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'>
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`} className='group block h-full'>
          <article className='flex flex-col h-full overflow-hidden rounded-xl md:rounded-[1rem] bg-stone-50/80 dark:bg-neutral-800/40 ring-1 ring-transparent transition-all duration-300 hover:ring-black/[0.06] hover:shadow-md dark:hover:ring-white/10'>
            <div className='relative aspect-[5/6] md:aspect-[4/5] overflow-hidden'>
              <Image
                src={post.pageCoverThumbnail}
                alt={post.title}
                fill
                sizes='(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw'
                className='object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]'
              />
              <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-65' />
              {post.tags?.[0] ? (
                <span className='absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[9px] md:text-[10px] font-medium text-white tracking-wide'>
                  {post.tags[0]}
                </span>
              ) : null}
              <span className='absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-neutral-900 text-[11px] opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0'>
                →
              </span>
            </div>
            <div className='flex flex-col flex-1 px-3 py-3 md:py-3.5'>
              <h3 className='text-[13px] md:text-[0.8125rem] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-snug line-clamp-2'>
                {post.title}
              </h3>
              {post.summarize ? (
                <p className='mt-1 text-[11px] md:text-[11.5px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed'>
                  {post.summarize}
                </p>
              ) : null}
              <div className='mt-auto pt-2.5 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-200/70 dark:border-white/[0.07]'>
                <time>{post.lastEditedDate}</time>
                <span className='text-[#62BFAD] font-medium'>Read</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default GuidePostCards;
