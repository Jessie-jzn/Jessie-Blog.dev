import { Search } from "react-notion-x";
import SiteConfig from "@/site.config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const NotionPageHeader = ({ block }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  console.log('router',router)
  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ href: string; label: string }>
  >([]);

  useEffect(() => {
    if (router && isBlogPost) {
      const pathSegments = router.asPath.split('/').filter(Boolean);
      const pathArray = [{ href: "/", label: t('home') }];

      let currentPath = "";
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentPath += `/${pathSegments[i]}`;
        const matchingLink = SiteConfig.navigationLinks.find(
          (link) => link.href === currentPath
        );

        if (matchingLink) {
          pathArray.push({
            href: matchingLink.href,
            label: t(matchingLink.title) || matchingLink.title,
          });
        }
      }

      // 添加文章标题
      pathArray.push({
        href: router.asPath,
        label: block.properties?.title?.[0]?.[0] || t('post'),
      });

      setBreadcrumbs(pathArray);
    }
  }, [router, block, isBlogPost]);

  if (!isBlogPost) {
    return null;
  }

  return (
    <header className="notion-header">
      <div
        className="notion-nav-header"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex items-center">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="breadcrumbs">
              <Link href={breadcrumb.href} className="breadcrumb">
                {breadcrumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && <span> / </span>}
            </div>
          ))}
        </div>

        <Search block={block} title={null} />
      </div>
    </header>
  );
};

export default NotionPageHeader;
