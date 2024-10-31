import { useState, useEffect } from 'react';
import { RelatedPostsService } from '@/lib/services/RelatedPostsService';
import * as Types from '@/lib/type';

interface RelatedPost {
  id: string;
  title: string;
  tags: string[];
}

export function useRelatedPosts(
  postData: Types.Post,
  allPosts: Types.Post[],
  tagOptions: Types.Tag[],
) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRelatedPosts() {
      if (!postData?.id || !allPosts?.length || !tagOptions?.length) return;

      setIsLoading(true);
      setError(null);

      try {
        const relatedPostsService = new RelatedPostsService();
        const posts = await relatedPostsService.getRelatedPosts(
          postData,
          allPosts,
          tagOptions
        );
        setRelatedPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch related posts'));
        console.error('Error loading related posts:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [postData, allPosts, tagOptions]);

  return { relatedPosts, isLoading, error };
}
