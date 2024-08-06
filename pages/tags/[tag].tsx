import getDataBaseList from "@/lib/notion/getDataBaseList";
import ListLayoutWithTags from "@/components/ListLayoutWithTags";
import { GetStaticPaths } from "next";
import * as Types from "@/lib/type";
import { GetStaticProps } from "next";
import { NOTION_POST_ID } from "@/lib/constants";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("params", params);
  try {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "tags-index",
    });

    const filteredPosts =
      response.tagOptions?.find((tag: Types.Tag) => tag.id === params?.tag)
        ?.articles || [];

    return {
      props: {
        tagOptions: response.tagOptions || [],
        posts: filteredPosts || [],
      },
      revalidate: 10,
    };
  } catch (error) {
    return {
      props: {
        tagOptions: [],
        posts: [],
      },
      revalidate: 10,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "tags-index",
  });
  const paths = (response.tagOptions as Types.Tag[]).map((tag: Types.Tag) => ({
    params: { tag: encodeURI(tag.id) },
  }));

  return {
    paths,
    fallback: true,
  };
};
export default function TagPage({
  tagOptions,
  posts,
}: {
  tagOptions: Types.Tag[];
  posts: Types.Post[];
}) {
  // const title = tagOptions[0].name.toUpperCase();
  return (
    <ListLayoutWithTags posts={posts} tagOptions={tagOptions} title="Tag" />
  );
}
