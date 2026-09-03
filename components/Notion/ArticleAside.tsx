/** 组合文章页的作者资料与相关推荐，使它们在同一个 Notion 侧栏中纵向排列。 */
import React from 'react';
import * as Types from '@/lib/type';
import NotionPageAside from './NotionPageAside';
import Sidebar from '@/components/Sidebar';

interface ArticleAsideProps {
  relatedPosts?: Types.Post[];
}

const ArticleAside: React.FC<ArticleAsideProps> = ({ relatedPosts }) => {
  return (
    <aside className='editorial-surface divide-y divide-line overflow-hidden rounded-2xl'>
      <Sidebar flat />
      <NotionPageAside relatedPosts={relatedPosts} />
    </aside>
  );
};

export default React.memo(ArticleAside);
