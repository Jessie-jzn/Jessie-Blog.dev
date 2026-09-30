/** 保留文章字段和封面容错，组织首页的网格、特色文章和照片版式。 */
import HomePostCard from '@/components/home/HomePostCard';
import type { Post } from '@/lib/type';

type GuidePost = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'category'
  | 'title'
  | 'pageCover'
  | 'pageCoverThumbnail'
  | 'summarize'
  | 'lastEditedDate'
  | 'publishDay'
  | 'lastEditedDay'
  | 'tags'
>;

const toArticle = (post: GuidePost): Post => ({
  ...post,
  type: 'Post',
  status: 'Published',
  tags: post.tags || [],
  pageCover: post.pageCover || post.pageCoverThumbnail || '',
  pageCoverThumbnail: post.pageCoverThumbnail || '',
});

const GuidePostCards = ({ posts, layout = 'grid' }: { posts: GuidePost[]; layout?: 'grid' | 'feature' | 'photos' }) => {
  if (!posts?.length) return null;

  const [lead, ...supporting] = posts;

  if (layout === 'feature') {
    return (
      <div className='space-y-4'>
        <HomePostCard post={toArticle(lead)} variant='feature' />
        {supporting.length ? <div className='grid gap-3 md:grid-cols-3'>{supporting.slice(0, 3).map((post) => <HomePostCard key={post.id} post={toArticle(post)} variant='compact' />)}</div> : null}
      </div>
    );
  }

  if (layout === 'photos') {
    return (
      <div className='grid gap-4 md:grid-cols-2'>
        <HomePostCard post={toArticle(lead)} variant='photo' />
        {supporting.length ? <div className='grid gap-4'>{supporting.slice(0, 2).map((post) => <HomePostCard key={post.id} post={toArticle(post)} variant='photo' />)}</div> : null}
      </div>
    );
  }

  return (
    <div className='grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map((post) => <HomePostCard key={post.id} post={toArticle(post)} />)}
    </div>
  );
};

export default GuidePostCards;
