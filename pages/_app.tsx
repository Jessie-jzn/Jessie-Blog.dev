import { ThemeProvider } from "next-themes";
import { appWithTranslation } from "next-i18next";
import "react-notion-x/src/styles.css";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/notion.css";
import nextI18NextConfig from "../next-i18next.config";
import BaseLayout from "@/components/layouts/BaseLayout";
// import CustomLayout from "@/components/CustomLayout/index";
// import SiteConfig from "../site.config";
import Head from "next/head";

import "../i18n"; // 导入 i18n.js 文件
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";

interface MyAppProps {
  Component: React.ComponentType & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
  pageProps: Record<string, unknown>;
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).gtag("config", "G-RDJEQXSM3X", {
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <>
      <Head>
        {/* 预先连接到 GTM */}
        {/* <link rel="preconnect" href="https://www.googletagmanager.com" /> */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta
          name="google-adsense-account"
          content="ca-pub-9533100025276131"
        ></meta>
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
        <meta name="baidu-site-verification" content="codeva-oUzlmBUgI9" />
      </Head>

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDJEQXSM3X');
          `,
        }}
      ></Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-RDJEQXSM3X`}
      ></Script>

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9533100025276131"
        crossOrigin="anonymous"
      ></Script>
      <Script
        async
        custom-element="amp-ad"
        src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
      ></Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9533100025276131"
        crossOrigin="anonymous"
        strategy="afterInteractive" // 确保页面互动之后才加载广告脚本
      ></Script>
      <ThemeProvider
        defaultTheme="system"
        enableSystem={true}
        attribute="class"
      >
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig);
