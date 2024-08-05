import Link from "@/components/Link";
import { GetStaticProps } from "next";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import * as Types from "@/lib/type";

interface TagOptions {
  tagOptions: Types.Tag[];
}
export const getStaticProps: GetStaticProps = async () => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "tags-index",
  });

  return {
    props: {
      tagOptions: response.tagOptions,
    },
    revalidate: 10,
  };
};

const index = ({ tagOptions }: TagOptions) => {
  const sortedTags = tagOptions.sort((a, b) => a.count - b.count);
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:m-6 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagOptions.length === 0 && "No tags found."}
          {sortedTags.map((t: Types.Tag) => {
            return (
              <div key={t.id} className="mb-2 mr-5 mt-2">
                <Link
                  href={`/tags/${t.id}`}
                  className="mr-3 text-gray-100 hover:text-gray-600 p-3 border-solid bg-[#14b8a6] rounded-md"
                >
                  {`${t.name}(${t.count})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default index;
