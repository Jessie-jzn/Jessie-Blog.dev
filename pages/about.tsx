// import Image from 'next/image';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import NotionService from '@/lib/notion/NotionServer';
import { NOTION_ABOUT_ID } from '@/lib/constants';
import NotionPage from '@/components/NotionPage';
const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async () => {
  // 提取包含指南的国家列表
  const post = await notionService.getPage(NOTION_ABOUT_ID);

  return {
    props: {
      post,
    },
    revalidate: 10,
  };
};
const About = ({ post }: any) => {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Jessie',
              description:
                'A passionate travel blogger who shares travel tips and stories.',
              url: 'https://next-notion-blog-gamma.vercel.app/about',
            }),
          }}
        />
      </Head>

      <NotionPage recordMap={post} />
    </>
  );
};
export default About;
