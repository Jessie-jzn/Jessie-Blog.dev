/** @type {import('next').NextConfig} */

const path = require("path");
const { i18n } = require("./next-i18next.config");
const isProd = process.env.NODE_ENV === "production";
// 打包时是否分析代码
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: false,
// });
// const repo = "Jessie-Blog.dev";
// const assetPrefix = `/${repo}/`;
// const basePath = `/${repo}`;

module.exports = {
  i18n,

  webpack: (config, { isServer }) => {
    // 添加别名配置
    config.resolve.alias["@"] = path.resolve(__dirname);

    // 如果需要在服务器端进行别名配置，则还需要进行服务端的别名配置
    if (isServer) {
      config.resolve.alias["@"] = path.resolve(__dirname);
    }

    return config;
  },
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
  images: {
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
    ],
  },
};
