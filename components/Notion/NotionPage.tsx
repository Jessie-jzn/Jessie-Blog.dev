import React, { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SiteConfig from "@/site.config";
import { searchNotion } from "@/lib/notion/searchNotion";
import { NotionComponents, NotionRenderer } from "react-notion-simplify";
import { Block, ExtendedRecordMap } from "notion-types";
import * as Types from "@/lib/type";
import styles from "./styles.module.css";
import NotionPropertyValue from "./NotionPropertyValue";
import NotionPageHeader from "./NotionPageHeader";
import NotionPageAside from "./NotionPageAside";
import Sidebar from "@/components/Sidebar";

import { BlogSEO } from "@/components/SEO";
import { mapPageUrl } from "@/lib/notion-utils";
import AdSense from "@/components/AdSense";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      import("prismjs/components/prism-markup-templating.js"),
      import("prismjs/components/prism-markup.js"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-cpp.js"),
      import("prismjs/components/prism-csharp.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-js-templates.js"),
      import("prismjs/components/prism-coffeescript.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-handlebars.js"),
      import("prismjs/components/prism-less.js"),
      import("prismjs/components/prism-makefile.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-objectivec.js"),
      import("prismjs/components/prism-ocaml.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-reason.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-sass.js"),
      import("prismjs/components/prism-scss.js"),
      import("prismjs/components/prism-solidity.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-stylus.js"),
      import("prismjs/components/prism-swift.js"),
      import("prismjs/components/prism-wasm.js"),
      import("prismjs/components/prism-yaml.js"),
    ]);
    return m.Code;
  })
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Modal = dynamic(() =>
  import("react-notion-x/build/third-party/modal").then((m) => m.Modal)
);
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
//   {
//     ssr: false,
//   },
// );

const minTableOfContentsItems = 3;

const propertyLastEditedTimeValue = (
  { block, pageHeader }: { pageHeader: boolean; block: Block },
  defaultFn: () => React.ReactNode
) =>
  NotionPropertyValue(
    {
      type: "lastEdited",
      block,
      pageHeader,
    },
    defaultFn
  );

const propertyDateValue = (
  {
    pageHeader,
    schema,
    block,
  }: { pageHeader: boolean; schema: any; block: Block },
  defaultFn: () => React.ReactNode
) =>
  NotionPropertyValue(
    {
      type: "published",
      block,
      schema,
      pageHeader,
    },
    defaultFn
  );

const propertyCreatedTimeValue = (
  { pageHeader, block }: { pageHeader: boolean; block: Block },
  defaultFn: () => React.ReactNode
) =>
  NotionPropertyValue(
    {
      type: "created",
      block,
      pageHeader,
    },
    defaultFn
  );

interface NotionPageProps {
  recordMap: ExtendedRecordMap;
  postData?: Types.PostData;
  relatedPosts?: Types.PostData[];
}

const NotionPage: React.FC<NotionPageProps> = ({
  recordMap,
  postData,
  relatedPosts,
}) => {
  const router = useRouter();
  const { locale } = router;

  // 添加错误处理和重定向逻辑
  useEffect(() => {
    if (!recordMap || !recordMap.block) {
      console.warn("Page not found, redirecting to home...");
      router.push("/");
      return;
    }
  }, [recordMap, router]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const showTableOfContents = !!isBlogPost;

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};

    const searchParams = new URLSearchParams(params);
    return mapPageUrl(recordMap, searchParams);
  }, [recordMap]);

  const components = useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      //   Pdf,
      Modal,
      //   Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyDateValue,
      propertyCreatedTimeValue,
    }),
    []
  );
  const pageAsideBottom = React.useMemo(
    () => <NotionPageAside relatedPosts={relatedPosts} />,
    [relatedPosts]
  );

  return (
    <>
      <BlogSEO
        title={postData?.title}
        description={postData?.slug || SiteConfig.description}
        createdTime={postData?.lastEditedDay || new Date()}
        lastEditTime={postData?.lastEditedDate || new Date()}
        image={postData?.pageCover || SiteConfig.defaultPageCover}
        keywords={postData?.keywords}
      />
      <div className="mx-10 xs:mx-0">
        <NotionRenderer
          bodyClassName={styles.notion}
          components={components as Partial<NotionComponents>}
          recordMap={recordMap}
          isShowingSearch={false}
          onHideSearch={() => {}}
          rootDomain={SiteConfig.domain}
          fullPage={true}
          previewImages={!!recordMap?.preview_images}
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          defaultPageIcon={SiteConfig.defaultPageIcon}
          defaultPageCover={SiteConfig.defaultPageCover}
          defaultPageCoverPosition={SiteConfig.defaultPageCoverPosition}
          mapPageUrl={siteMapPageUrl}
          // mapImageUrl={mapImageUrl}
          searchNotion={searchNotion}
          pageAsideTop={<Sidebar />}
          pageAsideBottom={pageAsideBottom}
          // footer={footer}
        />
      </div>

      <AdSense />
    </>
  );
};
export default NotionPage;
