/** @type {import('next').NextConfig} */
const path = require("path");
const { i18n } = require("./next-i18next.config");
const isProd = process.env.NODE_ENV === "production";
// 打包时是否分析代码
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  images: {
    domains: ["qiniu.jessieontheroad.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.wp.**",
      },
      {
        protocol: "https",
        hostname: "*.nextjswp.**",
      },
      {
        protocol: "https",
        hostname: "*.githubusercontent.**",
      },
      {
        protocol: "https",
        hostname: "*.aglty.**",
      },
      {
        protocol: "https",
        hostname: "*.notion.**",
      },
      {
        protocol: "https",
        hostname: "*.jessieontheroad.**",
      },
      {
        protocol: "https",
        hostname: "qiniu.jessieontheroad.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.dropbox.**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
  },
  swcMinify: true, // 启用 SWC 最小化
  env: {
    TRANSLATE_BAIDU_APPID: process.env.TRANSLATE_BAIDU_APPID,
    TRANSLATE_BAIDU_SECRETKEY: process.env.TRANSLATE_BAIDU_SECRETKEY,
  },

  webpack: (config, { isServer }) => {
    // 添加别名配置
    config.resolve.alias["@"] = path.resolve(__dirname);

    // 针对服务端和客户端的不同配置
    if (isServer) {
      config.resolve.alias["@"] = path.resolve(__dirname);
      config.resolve.fallback = {
        fs: false, // 禁用 Node.js 的 fs 模块（因为它在浏览器中无效）
      };
    }
    if (isProd) {
      // 生产环境优化配置
      config.optimization.minimize = true;
    }
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });
    config.module.rules.push({
      test: /\.xml$/,
      use: "raw-loader",
    });

    return config;
  },
  trailingSlash: true, // 确保你的 URL 末尾有斜杠
  async rewrites() {
    return [
      // 伪静态重写
      {
        source: "/:path*.html",
        destination: "/:path*",
      },
    ];
    // return [
    //   // 将以/api开头的路径代理到OpenAI API
    //   {
    //     source: "/api/:path*",
    //     destination: "https://api.fanyi.baidu.com/:path*",
    //   },
    // ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 60,
});

module.exports = nextConfig;
