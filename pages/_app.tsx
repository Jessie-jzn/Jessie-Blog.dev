import { ThemeProvider } from "next-themes";
// import "react-notion-x/src/styles.css";
// import "prismjs/themes/prism-tomorrow.css";
// import "katex/dist/katex.min.css";
import "tailwindcss/tailwind.css";
// import "../build.css";
import SiteConfig from "../site.config";

// import "../styles/main.css";
import "../styles/globals.css";
import "../styles/notion.css";

// import * as API from '@/lib/api/guide';
import RootLayout from "@/components/RootLayout";
import { Space_Grotesk } from "next/font/google";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface MyAppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

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
  return (
    <>
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
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-RDJEQXSM3X`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RDJEQXSM3X');
          `,
          }}
        ></script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9533100025276131"
          crossOrigin="anonymous"
        ></script>
        <script
          async
          custom-element="amp-ad"
          src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
        ></script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9533100025276131"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <ThemeProvider
        defaultTheme="system"
        enableSystem={true}
        attribute="class"
      >
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
