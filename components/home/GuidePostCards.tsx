import EditorialArticleCard from '@/components/articles/EditorialArticleCard';
import type { Post } from '@/lib/type';

type GuidePost = Pick<
  Post,
  | 'id'
  | 'slug'
  | 'category'
  | 'title'
  | 'pageCoverThumbnail'
  | 'summarize'
  | 'lastEditedDate'
  | 'tags'
>;

const toArticle = (post: GuidePost): Post => ({
  ...post,
  type: 'Post',
  status: 'Published',
  tags: post.tags || [],
  pageCover: post.pageCoverThumbnail || '',
  pageCoverThumbnail: post.pageCoverThumbnail || '',
});

const GuidePostCards = ({ posts }: { posts: GuidePost[] }) => {
  if (!posts?.length) return null;

  const [lead, ...supporting] = posts;

  return (
    <div className='grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]'>
      <EditorialArticleCard article={toArticle(lead)} variant='lead' priority />
      <div className='border-y border-line divide-y divide-line'>
        {supporting.map((post, index) => {
          const article = toArticle(post);

          return (
            <EditorialArticleCard
              key={article.id}
              article={article}
              variant='index'
              position={index + 2}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GuidePostCards;
