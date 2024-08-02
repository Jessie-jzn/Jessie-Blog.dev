import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import SiteConfig from "../site.config";
import SocialContactIcon from "./SocialContactIcon";
// import PageSocial from './PageSocial';
// import PropertyValue from './PropertyValue';
import { searchNotion } from "@/lib/notion/searchNotion";
// import { PageBlock } from 'notion-types'
import { getPageProperty } from "notion-utils";
import { NotionRenderer } from "react-notion-x";
import { Block } from "notion-types";
import * as Types from "@/lib/type";
import styles from "./styles.module.css";
import NotionPropertyValue from "./NotionPropertyValue";
import NotionPageHeader from "./NotionPageHeader";
import { BlogSEO } from "@/components/SEO";
import { mapImageUrl, mapPageUrl } from "@/lib/util";
import { Modal } from "react-notion-x/build/third-party/modal";
// import { NOTION_ROOT_ID } from "@/lib/constants";
import AdSense from "./AdSense";
// const Code = dynamic(() =>
//   import('react-notion-x/build/third-party/code').then(async (m) => {
//     // add / remove any prism syntaxes here
//     await Promise.allSettled([
//       import('prismjs/components/prism-markup-templating.js'),
//       import('prismjs/components/prism-markup.js'),
//       import('prismjs/components/prism-bash.js'),
//       import('prismjs/components/prism-c.js'),
//       import('prismjs/components/prism-cpp.js'),
//       import('prismjs/components/prism-csharp.js'),
//       import('prismjs/components/prism-docker.js'),
//       import('prismjs/components/prism-java.js'),
//       import('prismjs/components/prism-js-templates.js'),
//       import('prismjs/components/prism-coffeescript.js'),
//       import('prismjs/components/prism-diff.js'),
//       import('prismjs/components/prism-git.js'),
//       import('prismjs/components/prism-go.js'),
//       import('prismjs/components/prism-graphql.js'),
//       import('prismjs/components/prism-handlebars.js'),
//       import('prismjs/components/prism-less.js'),
//       import('prismjs/components/prism-makefile.js'),
//       import('prismjs/components/prism-markdown.js'),
//       import('prismjs/components/prism-objectivec.js'),
//       import('prismjs/components/prism-ocaml.js'),
//       import('prismjs/components/prism-python.js'),
//       import('prismjs/components/prism-reason.js'),
//       import('prismjs/components/prism-rust.js'),
//       import('prismjs/components/prism-sass.js'),
//       import('prismjs/components/prism-scss.js'),
//       import('prismjs/components/prism-solidity.js'),
//       import('prismjs/components/prism-sql.js'),
//       import('prismjs/components/prism-stylus.js'),
//       import('prismjs/components/prism-swift.js'),
//       import('prismjs/components/prism-wasm.js'),
//       import('prismjs/components/prism-yaml.js'),
//     ]);
//     return m.Code;
//   }),
// );

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
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
const NotionPage: React.FC<Types.PageProps> = ({
  site,
  recordMap,
  //   error,
  //   pageId,
}) => {
  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const showTableOfContents = !!isBlogPost;

  const title = SiteConfig.title;
  const socialDescription =
    getPageProperty<string>("Description", block, recordMap) ||
    SiteConfig.description;
  const socialImage = mapImageUrl(
    (block as Block)?.format?.page_cover || SiteConfig.defaultPageCover,
    block
  );
  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    // if (lite) params.lite = lite;

    const searchParams = new URLSearchParams(params);
    return mapPageUrl(recordMap, searchParams);
  }, [recordMap]);

  const lastEditTime =
    getPageProperty<string>("last_edited_time", block, recordMap) || new Date();
  const createdTime =
    getPageProperty<string>("created_time", block, recordMap) || new Date();

  const components = useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      //   Code,
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
  const pageAside = React.useMemo(() => <SocialContactIcon />, []);

  return (
    <>
      <BlogSEO
        title={title}
        description={socialDescription}
        createdTime={createdTime}
        lastEditTime={lastEditTime}
        image={socialImage}
      />
      <NotionRenderer
        bodyClassName={styles.notion}
        components={components}
        recordMap={recordMap}
        isShowingSearch={false}
        onHideSearch={() => {}}
        // rootPageId={NOTION_ROOT_ID}
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
        pageAside={pageAside}
        // footer={footer}
      />
      <AdSense />
    </>
  );
};
export default NotionPage;
