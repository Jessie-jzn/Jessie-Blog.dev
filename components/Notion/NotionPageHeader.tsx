import { Search } from "react-notion-x";
import SiteConfig from "@/site.config";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import type { PostData } from "@/lib/type";

interface BreadcrumbsProps {
  postData?: PostData;
}

/**
 * 独立面包屑组件，基于 postData 和路由路径生成，不依赖 react-notion-x 的 block 结构。
 * 可在 NotionRenderer 外部直接使用。
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ postData }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const breadcrumbs = useMemo(() => {
    if (!postData) return [];

    const items: { href: string; label: string }[] = [
      { href: "/", label: t("nav.home") },
    ];

    const pathSegments = router.asPath.split("/").filter(Boolean);

    // 用路径中间段匹配导航配置（如 /travel-zh/xxx → /travel）
    let currentPath = "";
    for (let i = 0; i < pathSegments.length - 1; i++) {
      currentPath += `/${pathSegments[i]}`;
      const matchingLink = SiteConfig.navigationLinks.find(
        (link: { href: string; title: string }) => link.href === currentPath
      );
      if (matchingLink) {
        items.push({
          href: matchingLink.href,
          label: t(matchingLink.title) || matchingLink.title,
        });
      }
    }

    // 如果有 category 且上面没匹配到，补一层分类
    if (postData.category && items.length === 1) {
      const categorySlug = pathSegments[0];
      if (categorySlug) {
        const matchByCategory = SiteConfig.navigationLinks.find(
          (link: { href: string }) =>
            link.href !== "/" &&
            categorySlug.startsWith(link.href.replace("/", ""))
        );
        if (matchByCategory) {
          items.push({
            href: matchByCategory.href,
            label: t(matchByCategory.title) || matchByCategory.title,
          });
        }
      }
    }

    items.push({
      href: router.asPath,
      label: postData.title || "Untitled",
    });

    return items;
  }, [postData, router.asPath, t]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 py-2 overflow-x-auto whitespace-nowrap">
      {breadcrumbs.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {idx > 0 && <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>}
          {idx < breadcrumbs.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[300px]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

/**
 * NotionRenderer 内部 Header（保留搜索功能）。
 * 面包屑已移到外部 Breadcrumbs 组件，此处不再渲染面包屑。
 */
const NotionPageHeader = ({ block }: any) => {
  return (
    <header className="notion-header">
      <div className="notion-nav-header" style={{ justifyContent: "flex-end" }}>
        <Search block={block} title={null} />
      </div>
    </header>
  );
};

export default NotionPageHeader;
