import { ThemeProvider } from "next-themes"; // 导入主题提供者，用于主题管理
import { appWithTranslation } from "next-i18next"; // 导入国际化支持
import "tailwindcss/tailwind.css"; // 导入 Tailwind CSS 样式
import "react-notion-simplify/dist/themes/prism-theme.css"; // 导入 Prism 主题样式
import "react-notion-simplify/dist/styles/styles.css"; // 导入 Notion 简化样式
import "../styles/notion.css"; // 导入自定义 Notion 样式
import "../styles/globals.css"; // 导入全局样式
import "react-markdown-editor-lite/lib/index.css";

// 导入主题样式
import "../styles/markdown.css"; // 导入自定义 Markdown 样式
import "../styles/markdown-tui.css"; // 导入自定义 Markdown 样式
import "../styles/markdown-github.css"; // 导入自定义 Markdown 样式

import nextI18NextConfig from "../next-i18next.config.js"; // 导入国际化配置
import BaseLayout from "@/components/layouts/BaseLayout"; // 导入基础布局组件
// import CustomLayout from "@/components/CustomLayout/index"; // 可选的自定义布局
// import SiteConfig from "../site.config"; // 可选的网站配置
import Head from "next/head"; // 导入 Head 组件，用于设置页面头部信息

import "../i18n"; // 导入 i18n.js 文件，初始化国际化
import { useEffect } from "react"; // 导入 useEffect 钩子
import { useRouter } from "next/router"; // 导入路由钩子
import Script from "next/script"; // 导入 Script 组件，用于添加外部脚本

interface MyAppProps {
  Component: React.ComponentType & {
    getLayout?: (page: React.ReactElement) => React.ReactNode; // 定义可选的布局函数
  };
  pageProps: Record<string, unknown>; // 定义页面属性
}

const MyApp = ({ Component, pageProps }: MyAppProps) => {
  const router = useRouter(); // 获取路由对象

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        // Google Analytics 路由变化跟踪
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange); // 监听路由变化完成事件
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange); // 清理事件监听
    };
  }, [router.events]);

  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>); // 获取布局，如果没有则使用基础布局

  return (
    <>
      <Head>
        {/* 预先连接到 GTM */}
        {/* <link rel="preconnect" href="https://www.googletagmanager.com" /> */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />{" "}
        {/* DNS 预取 */}
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_ADSENSE_ID} // Google AdSense 账户信息
        ></meta>
        <meta name="msapplication-TileColor" content="#000000" />{" "}
        {/* Windows 瓷砖颜色 */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff" // 浅色主题颜色
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000" // 深色主题颜色
        />
        <meta name="baidu-site-verification" content="codeva-oUzlmBUgI9" />{" "}
        {/* 百度站点验证 */}
      </Head>

      <Script
        id="google-analytics"
        strategy="afterInteractive" // 确保在页面交互后加载
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `,
        }}
      ></Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} // 加载 Google Analytics 脚本
      ></Script>

      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`} // 加载 Google AdSense 脚本
        crossOrigin="anonymous"
      ></Script>
      <Script
        async
        custom-element="amp-ad"
        src="https://cdn.ampproject.org/v0/amp-ad-0.1.js" // 加载 AMP 广告脚本
      ></Script>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`} // 加载 Google AdSense 脚本
        crossOrigin="anonymous"
        strategy="afterInteractive" // 确保页面互动之后才加载广告脚本
      ></Script>
      <Script
        id="custom-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = '${process.env.NEXT_PUBLIC_CUSTOM_SCRIPT_URL}'; // 加载自定义脚本
                document.head.appendChild(script);
            })();
          `,
        }}
      />
      <Script
        id="custom-script-2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = 'https://emrldtp.cc/MzMyNjk0.js?t=332694';
                document.head.appendChild(script);
            })();
          `,
        }}
        data-noptimize="1"
        data-cfasync="false"
        data-wpfc-render="false"
      />
      <Script
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
      ></Script>
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; // 加载 Microsoft Clarity 脚本
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `,
        }}
      />
      <ThemeProvider
        defaultTheme="system" // 默认主题为系统主题
        enableSystem={true} // 启用系统主题
        attribute="class" // 使用 class 属性来控制主题
      >
        {getLayout(<Component {...pageProps} />)} {/* 渲染页面组件 */}
      </ThemeProvider>
    </>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig); // 导出带有国际化支持的 MyApp 组件
