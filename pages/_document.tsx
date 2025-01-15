// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="google-site-verification"
          content="W2wkuqoDDz3O3Q48KLqG2HQOSnx4gFvUU8yLgOcXT-0"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/avatar.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/avatar.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/avatar.png"
        />
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-RDJEQXSM3X"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
