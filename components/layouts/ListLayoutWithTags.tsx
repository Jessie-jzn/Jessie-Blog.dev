import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import * as Types from "@/lib/type";
import PageHeader from "@/components/common/PageHeader";
import FilterPills from "@/components/common/FilterPills";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";

interface ListLayoutWithTagsProps {
  posts: Types.Post[];
  title: string;
  tagOptions: Types.Tag[];
}

const ListLayoutWithTags: React.FC<ListLayoutWithTagsProps> = ({
  posts,
  title,
  tagOptions = [],
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const safePosts = Array.isArray(posts) ? posts : [];
  const rawActiveTag = pathname?.split("/tags/")[1]?.split(/[?#]/)[0] || "";
  let activeTagId = rawActiveTag;

  try {
    activeTagId = decodeURIComponent(rawActiveTag);
  } catch {
    activeTagId = rawActiveTag;
  }

  // Use useMemo to optimize the computation of filteredBlogPosts
  const filteredBlogPosts = useMemo(() => {
    return safePosts.filter((post) => {
      const searchContent = [
        post.title,
        post.summarize,
        post.tags?.join(" ") || "",
      ].join(" ");

      return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [safePosts, searchValue]);

  // Use useMemo to optimize the computation of displayPosts
  const displayPosts = useMemo(() => {
    return !searchValue ? safePosts : filteredBlogPosts;
  }, [safePosts, filteredBlogPosts, searchValue]);

  const filterItems = useMemo(
    () => [
      {
        id: "all",
        name: "All Articles",
      },
      ...tagOptions.map((tag) => ({
        id: tag.id,
        name: `${tag.name || tag.id} (${tag.count})`,
      })),
    ],
    [tagOptions],
  );

  const handleFilterChange = (item: { id: string }) => {
    if (item.id === "all") {
      void router.push("/post");
      return;
    }

    void router.push(`/tags/${encodeURIComponent(item.id)}`);
  };

  return (
    <div className="min-h-[60vh] bg-canvas text-ink">
      <PageHeader
        eyebrow="Articles"
        title={title}
        meta={`${displayPosts.length} article${displayPosts.length === 1 ? "" : "s"}`}
      />

      <div className="site-container pb-16 md:pb-24">
        <div className="mb-6 md:hidden">
          <FilterPills
            items={filterItems}
            activeId={activeTagId || "all"}
            onChange={handleFilterChange}
            ariaLabel="Browse articles by tag"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden md:block">
            <nav
              aria-label="Browse articles by tag"
              className="editorial-surface sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto rounded-2xl p-5"
            >
              <Link
                href="/post"
                className="editorial-focus block rounded-xl px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-muted hover:text-primaryStrong"
              >
                All Articles
              </Link>
              <ul className="mt-2 space-y-1">
                {!!tagOptions.length &&
                  tagOptions.map((tag: Types.Tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/tags/${encodeURIComponent(tag.id)}`}
                        aria-current={activeTagId === tag.id ? "page" : undefined}
                        className={`editorial-focus flex min-h-10 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                          activeTagId === tag.id
                            ? "bg-primarySoft font-semibold text-primaryStrong"
                            : "text-subtle hover:bg-muted hover:text-ink"
                        }`}
                        aria-label={`View articles tagged ${tag.name || tag.id}`}
                      >
                        <span>{tag.name || tag.id}</span>
                        <span className="text-xs">{tag.count}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>

          <main className="min-w-0">
            <div className="relative mb-6 max-w-xl">
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <input
                id="article-search"
                aria-label="Search articles"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search articles"
                className="editorial-focus block min-h-11 w-full rounded-xl border border-line bg-surface px-4 py-2.5 pr-11 text-ink placeholder:text-subtle"
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 h-5 w-5 text-subtle"
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

            {displayPosts.length ? (
              <ul className="space-y-5">
                {displayPosts.map((post: Types.Post, index) => (
                  <li key={post.id}>
                    <EditorialArticleCard
                      article={post}
                      variant="row"
                      priority={index === 0}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="editorial-surface rounded-2xl p-6 text-sm text-subtle"
                role="status"
              >
                No articles found.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListLayoutWithTags;
