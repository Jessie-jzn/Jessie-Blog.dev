import { NotionAPI } from '../notion/NotionAPI';
import * as Types from '@/lib/type';
import getAllTagsList from '../notion/getAllTagsList';

interface RelatedPost {
  id: string;
  title: string;
  tags: string[];
}

export class RelatedPostsService {
  private notionApi: NotionAPI;

  constructor(databaseId?: string) {
    this.notionApi = new NotionAPI({ databaseId });
  }

  /**
   * 根据标签获取相关文章
   * @param currentPost 当前文章
   * @param allPosts 所有文章
   * @param tagOptions 标签选项
   * @param maxRelatedPosts 最大相关文章数量
   * @returns 相关文章列表
   */
  async getRelatedPosts(
    currentPost: Types.Post,
    allPosts: Types.Post[],
    tagOptions: Types.Tag[],
    maxRelatedPosts: number = 5
  ): Promise<RelatedPost[]> {
    try {
      if (!currentPost?.tags?.length) {
        return [];
      }

      // 1. 使用 getAllTagsList 获取标签映射
      const tagList = getAllTagsList({
        allPages: allPosts,
        tagOptions: tagOptions,
      });

      // 2. 获取当前文章的标签对应的所有文章
      const relatedPosts = new Set<Types.Post>();
      
      // 遍历当前文章的标签
      for (const currentTag of currentPost.tags) {
        // 找到对应的标签信息
        const tagInfo = tagList.find(tag => tag.value === currentTag);
        if (tagInfo && tagInfo.articles) {
          // 添加该标签下的所有文章（排除当前文章）
          tagInfo.articles
            .filter(post => post.id !== currentPost.id)
            .forEach(post => {
              if (relatedPosts.size < maxRelatedPosts) {
                relatedPosts.add(post);
              }
            });
        }
      }

      // 3. 转换为所需格式
      return Array.from(relatedPosts).map(post => ({
        id: post.id,
        title: post.title || '',
        tags: post.tags || []
      }));

    } catch (error) {
      console.error('Error getting related posts:', error);
      return [];
    }
  }

  /**
   * 查找相关标签
   * @param currentTags 当前文章的标签
   * @param tagOptions 所有标签选项
   * @returns 相关标签列表
   */
  private findRelatedTags(currentTags: string[], tagOptions: Types.Tag[]): Types.Tag[] {
    // 这里可以实现更复杂的标签关联逻辑
    // 目前简单返回所有其他标签
    return tagOptions.filter(tag => !currentTags.includes(tag.name));
  }

  /**
   * 计算文章相关度
   * 根据共同标签数量来排序相关文章
   * @param currentPost 当前文章
   * @param relatedPost 相关文章
   * @returns 相关度分数
   */
  private calculateRelevance(currentPost: Types.Post, relatedPost: Types.Post): number {
    const currentTags = new Set(currentPost.tags);
    return relatedPost.tags.filter(tag => currentTags.has(tag)).length;
  }

  /**
   * 对相关文章进行排序
   * @param currentPost 当前文章
   * @param relatedPosts 相关文章列表
   * @returns 排序后的文章列表
   */
  private sortByRelevance(currentPost: Types.Post, relatedPosts: Types.Post[]): Types.Post[] {
    return [...relatedPosts].sort((a, b) => 
      this.calculateRelevance(currentPost, b) - this.calculateRelevance(currentPost, a)
    );
  }
}
