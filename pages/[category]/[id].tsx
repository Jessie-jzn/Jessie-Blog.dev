import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import React,{useState,useEffect} from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SiteConfig from "@/site.config";
import { baiduTranslate } from '@/lib/baidu/baiduTranslate';

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: any) => {
  const postId = params?.id as string;
  const post = await notionService.getPage(postId);

  console.log('postpostpostpostpost',post)

  return {
    props: {
      post: post,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 100,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  for (const [databaseId, routePrefix] of Object.entries(SiteConfig.databaseMapping)) {
    if (databaseId) {
      const posts = await getDataBaseList({
        pageId: databaseId,
        from: "post-id",
      });

      if (posts.pageIds) {
        paths.push(...posts.pageIds.map((postId: string) => ({
          params: { category: routePrefix, id: postId },
        })));
      }
    }
  }

  return {
    paths,
    fallback: true,
  };
};
// export async function getServerSideProps({ params, locale }) {
//   const notionAPI = new NotionAPI()
//   const pageData = await notionAPI.getPage(params.slug, 'zh') // 始终获取中文版本
//   return { props: { pageData } }
// }
const RenderPost = ({ post }: any): React.JSX.Element => {
  console.log('post',post)
  const [translatedPost, setTranslatedPost] = useState(post);
  const [language, setLanguage] = useState('en');
  const translateText = async (text: string) => {
    const response= await baiduTranslate(text, 'en', 'zh');
    const data = await response.json();
    return data.translation;
  };

  const extractTextFromPost = (post: any) => {
    let text = '';
    console.log('post',post.block)
    for (const blockId in post.block) {
      const block = post.block[blockId].value;
    console.log('block',block)

      if (block.properties) {
        for (const prop in block.properties) {
          const textArray = block.properties[prop];
          for (let i = 0; i < textArray.length; i++) {
            text += textArray[i][0] + ' ';
          }
        }
      }
    }
    return text;
  };

  const translatePost = async () => {
    const text = extractTextFromPost(post);
    const translatedText = await translateText(text);

    const newPost = { ...post };
    let textIndex = 0;
    for (const blockId in newPost.block) {
      const block = newPost.block[blockId].value;
      if (block.properties) {
        for (const prop in block.properties) {
          const textArray = block.properties[prop];
          for (let i = 0; i < textArray.length; i++) {
            const originalText = textArray[i][0];
            const translatedSegment = translatedText.slice(textIndex, textIndex + originalText.length);
            textArray[i][0] = translatedSegment;
            textIndex += originalText.length + 1; // +1 for the space added during extraction
          }
        }
      }
    }
    setTranslatedPost(newPost);
  };

  useEffect(() => {
   
    translatePost();
    // if (language !== 'en') {
    //   translatePost();
    // } else {
    //   setTranslatedPost(post);
    // }
  }, []);

  return (
    <>
      <div className="flex-auto mx-auto w-full pt-[190px]">
        <NotionPage recordMap={translatedPost} />
      </div>
    </>
  );
};

export default RenderPost;