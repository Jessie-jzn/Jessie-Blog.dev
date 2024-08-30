import { Breadcrumbs, Search } from "react-notion-x";
import SiteConfig from "@/site.config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const NotionPageHeader = ({ block }: any) => {
  const router = useRouter();
  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ href: string; label: string }>
  >([]);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath?.slice(0, -1)?.map((path, index) => {
        const href = "/" + linkPath.slice(0, index + 1).join("/");
        const matchingLink = SiteConfig.navigationLinks.find(
          (link) => link.href === href
        );
        return {
          href,
          label: matchingLink ? matchingLink.title : decodeURIComponent(path),
        };
      });
      setBreadcrumbs(pathArray);
    }
  }, [router]);

  return (
    <>
      {!isBlogPost ? (
        <></>
      ) : (
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
                  <div> / </div>
                </div>
              ))}
              <Breadcrumbs block={block} rootOnly={true} />
            </div>

            <Search block={block} title={null} />
          </div>
        </header>
      )}
    </>
  );
};
export default NotionPageHeader;
