import { GetStaticPaths, GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import getSinglePostData from "@/lib/notion/getSinglePostData";
import React from "react";
import NotionPage from "@/components/Notion/NotionPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SiteConfig from "@/site.config";
import * as Type from "@/lib/type";
import { ExtendedRecordMap } from "notion-types";

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: any) => {
  const postId = params?.id as string;
  const recordMap = await notionService.getPage(postId);

  const collection =
    (Object.values(recordMap.collection)[0] as any)?.value || {};

  const schema = collection?.schema;
 
   const block = recordMap.block[postId]?.value;

   const databaseId = block?.parent_id
  // 获取当前文章的数据
  const postData = await getSinglePostData(postId, block, schema);
  console.log('postData',postData,postData?.tagItems)

  const { tagOptions } = await getDataBaseList({
    pageId: databaseId,
    from: "postId-databaseId-index",
  });
  console.log('tagOptions',recordMap,tagOptions,databaseId)

  // const currentPostTags = postData?.tags || []; // 假设 postData 中有 tags 属性
  // const matchingTags = tagOptions.filter((tag: string) => 
  //   currentPostTags.includes(tag)
  // );

  return {
    props: {
      recordMap: recordMap,
      postData: postData,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 100,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];

  for (const [databaseId, routePrefix] of Object.entries(
    SiteConfig.databaseMapping
  )) {
    if (databaseId) {
      const response = await getDataBaseList({
        pageId: databaseId,
        from: "post-id",
      });

      if (response.pageIds) {
        paths.push(
          ...response.pageIds.map((postId: string) => ({
            params: { category: routePrefix, id: postId },
          }))
        );
      }
    }
  }

  return {
    paths,
    fallback: true,
  };
};

const RenderPost = ({
  recordMap,
  postData,
}: {
  recordMap: ExtendedRecordMap;
  postData: Type.PostData;
}): React.JSX.Element => {
  // const [translatedPost, setTranslatedPost] = useState(post);
  // const [language, setLanguage] = useState('en');
  // const translateText = async (text: string) => {
  //   const response = await baiduTranslate(text, 'en', 'zh');
  //   const data = await response.json();
  //   return data.translation;
  // };

  // const extractTextFromPost = (post: any) => {
  //   let text = '';
  //   console.log('post', post.block)
  //   for (const blockId in post.block) {
  //     const block = post.block[blockId].value;
  //     console.log('block', block)

  //     if (block.properties) {
  //       for (const prop in block.properties) {
  //         const textArray = block.properties[prop];
  //         for (let i = 0; i < textArray.length; i++) {
  //           text += textArray[i][0] + ' ';
  //         }
  //       }
  //     }
  //   }
  //   return text;
  // };

  // const translatePost = async () => {
  //   const text = extractTextFromPost(post);
  //   const translatedText = await translateText(text);

  //   const newPost = { ...post };
  //   let textIndex = 0;
  //   for (const blockId in newPost.block) {
  //     const block = newPost.block[blockId].value;
  //     if (block.properties) {
  //       for (const prop in block.properties) {
  //         const textArray = block.properties[prop];
  //         for (let i = 0; i < textArray.length; i++) {
  //           const originalText = textArray[i][0];
  //           const translatedSegment = translatedText.slice(textIndex, textIndex + originalText.length);
  //           textArray[i][0] = translatedSegment;
  //           textIndex += originalText.length + 1; // +1 for the space added during extraction
  //         }
  //       }
  //     }
  //   }
  //   setTranslatedPost(newPost);
  // };

  // useEffect(() => {

  //   translatePost();
  //   // if (language !== 'en') {
  //   //   translatePost();
  //   // } else {
  //   //   setTranslatedPost(post);
  //   // }
  // }, []);

  return (
    <div className="pt-[170px]">
      <NotionPage recordMap={recordMap} postData={postData} />
    </div>
  );
};

export default RenderPost;
