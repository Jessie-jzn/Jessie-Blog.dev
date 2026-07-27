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

const GuidePostCards = ({ posts }: { posts: GuidePost[] }) => {
  if (!posts?.length) return null;

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'>
      {posts.map((post, index) => {
        const article: Post = {
          ...post,
          type: 'Post',
          status: 'Published',
          tags: post.tags || [],
          pageCover: post.pageCoverThumbnail || '',
          pageCoverThumbnail: post.pageCoverThumbnail || '',
        };

        return (
          <EditorialArticleCard
            key={article.id}
            article={article}
            variant='feature'
            priority={index === 0}
          />
        );
      })}
    </div>
  );
};

export default GuidePostCards;
