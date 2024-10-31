import React from "react";
import SocialContactIcon from "@/components/SocialContactIcon";
import RelatedPosts from "@/components/RelatedPosts/RelatedPosts";
import { useRelatedPosts } from "@/hooks/useRelatedPosts";
import { NOTION_POST_ID } from '@/lib/constants';

interface NotionPageAsideProps {
  postData?: any;
}

const NotionPageAside: React.FC<NotionPageAsideProps> = ({ postData }) => {
  // 使用自定义Hook获取相关文章
  const { relatedPosts, isLoading, error } = useRelatedPosts(
    postData,
    NOTION_POST_ID
  );
  return (
    <div className="bg-white mt-5 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">相关推荐</h2>
      <SocialContactIcon />
      {/* 使用独立的RelatedPosts组件 */}
      <RelatedPosts posts={relatedPosts} isLoading={isLoading} error={error} />
    </div>
  );
};

export default NotionPageAside;
