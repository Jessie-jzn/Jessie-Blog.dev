import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Types from "@/lib/type";

interface ListLayoutWithTagsProps {
  posts: Types.Post[];
  title: string;
  tagOptions: Types.Tag[];
}

const ListLayoutWithTags: React.FC<ListLayoutWithTagsProps> = ({
  posts: initialDisplayPosts,
  title,
  tagOptions = [],
}) => {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");
  // 使用 useMemo 优化 filteredBlogPosts 的计算
  const filteredBlogPosts = useMemo(() => {
    return initialDisplayPosts.filter((post) => {
      const searchContent = [
        post?.title || "", // 默认值为空字符串
        post?.slug || "", // 默认值为空字符串
        post?.tags?.join(" ") || "", // 默认值为空字符串
      ].join(" ");

      return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [initialDisplayPosts, searchValue]);

  // 使用 useMemo 优化 displayPosts 的计算
  const displayPosts = useMemo(() => {
    return !searchValue ? initialDisplayPosts : filteredBlogPosts;
  }, [initialDisplayPosts, filteredBlogPosts, searchValue]);

  return (
    <>
      <div className="grid grid-cols-4 pt-6 pb-8">
        <div className="col-span-1">
          <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith("/post") ? (
                <h3 className="font-bold uppercase text-primary-500">
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/post`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {tagOptions.map((t: Types.Tag) => (
                  <li key={t.id} className="my-3">
                    {pathname.split("/tags/")[1] === t.id ? (
                      <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                        {`${t.name} (${t.count})`}
                      </h3>
                    ) : (
                      <Link
                        href={`/tags/${t.id}`}
                        className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                        aria-label={`View posts tagged ${t.name}`}
                      >
                        {`${t.name} (${t.count})`}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-3 divide-y divide-gray-200 pl-8 dark:divide-gray-700">
          <div className="space-y-2 pb-8 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              {title}
            </h1>
            <div className="relative max-w-lg">
              <label>
                <span className="sr-only">Search articles</span>
                <input
                  aria-label="Search articles"
                  type="text"
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search articles"
                  className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                />
              </label>
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <ul>
            {!filteredBlogPosts.length && "No posts found."}
            {displayPosts.map((post: Types.Post) => {
              const { id, title, slug, tags, lastEditedDate } = post;
              return (
                <li key={id} className="py-4">
                  <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={lastEditedDate}>{lastEditedDate}</time>
                      </dd>
                    </dl>
                    <div className="space-y-3 xl:col-span-3">
                      <div>
                        <h3 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/post/${id}`}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap">
                          {tags?.map((tag: string) => (
                            <div
                              key={tag}
                              className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 p-0.5 bg-[#c8d2d2] rounded-md"
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {slug}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListLayoutWithTags;
