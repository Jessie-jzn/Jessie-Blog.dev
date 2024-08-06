/** @type {import('next').NextConfig} */

const path = require("path");
const isProd = process.env.NODE_ENV === "production";
// 打包时是否分析代码
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: false,
// });
// const repo = "Jessie-Blog.dev";
// const assetPrefix = `/${repo}/`;
// const basePath = `/${repo}`;

module.exports = {
  // env: {
  //   OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  //   SITE_URL: process.env.SITE_URL, // 替换为你的站点URL
  // },
  output: "export",
  basePath: isProd ? "/Jessie-Blog.dev" : "",
  // assetPrefix,
  // basePath,
  // reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // 添加别名配置
    config.resolve.alias["@"] = path.resolve(__dirname);
    // config.resolve.alias['@/notion'] = path.resolve(__dirname, 'lib', 'notion');
    // config.resolve.alias['dns'] = path.resolve(__dirname, 'empty.js');
    // config.resolve.alias['fs'] = path.resolve(__dirname, 'empty.js');

    // 如果需要在服务器端进行别名配置，则还需要进行服务端的别名配置
    if (isServer) {
      config.resolve.alias["@"] = path.resolve(__dirname);
    }

    return config;
  },
  async rewrites() {
    return [
      // 将以/api开头的路径代理到OpenAI API
      {
        source: "/api/:path*",
        destination: "https://api.openai.com/:path*",
      },
    ];
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
