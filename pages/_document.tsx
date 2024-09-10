// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";
import { CommonSEO } from "@/components/SEO";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="google-site-verification"
          content="W2wkuqoDDz3O3Q48KLqG2HQOSnx4gFvUU8yLgOcXT-0"
        />
        {/* 其他 meta 标签和链接 */}
        <CommonSEO />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
