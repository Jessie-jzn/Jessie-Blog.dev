// hooks/useLocalizedPosts.ts
// CSR 用 useLocalizedPosts
import useSWR from "swr";
import { processTags } from "@/lib/util";
import getDataBaseList from "@/lib/notion/getDataBaseList"; // 封装的数据库读取函数
import { useRouter } from "next/router";

// 定义文章结构
interface Post {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  [key: string]: any;
}

interface TagOption {
  label: string;
  value: string;
  count?: number;
}

// 请求参数类型
interface UseLocalizedPostsProps {
  pageId: string;
  categories: [string, string]; // 中英两个分类 key
  from?: string; // 来源
}

export const useLocalizedPosts = ({
  pageId,
  categories,
  from = "default",
}: UseLocalizedPostsProps) => {
  const { locale } = useRouter(); // 获取当前语言（Next.js 内置）

  // 构造 SWR 的缓存 key
  const key = `${pageId}_${locale}_${from}_${categories.join("_")}`;

  const fetcher = async (): Promise<{
    posts: Post[];
    tagOptions: TagOption[];
  }> => {
    const [enCategory, zhCategory] = categories;

    // 根据语言判断主次顺序
    const [primaryKey, secondaryKey] =
      locale === "en" ? [enCategory, zhCategory] : [zhCategory, enCategory];

    // 从 Notion 获取数据
    const response = await getDataBaseList({
      pageId,
      from,
      filter: (post: Post) =>
        post.category === enCategory || post.category === zhCategory,
    });

    const primaryPosts = response.categoryMap?.[primaryKey]?.articles || [];
    const secondaryPosts = response.categoryMap?.[secondaryKey]?.articles || [];

    const allPosts = [...primaryPosts, ...secondaryPosts];

    const tagMap = processTags(response.tagOptions || []);
    const tagOptions = Array.from(tagMap.values()) as unknown as TagOption[];

    return { posts: allPosts, tagOptions };
  };

  const { data, error, isLoading } = useSWR<{
    posts: Post[];
    tagOptions: TagOption[];
  }>(key, fetcher);

  return {
    posts: data?.posts || [],
    tagOptions: data?.tagOptions || [],
    isLoading,
    error,
  };
};
