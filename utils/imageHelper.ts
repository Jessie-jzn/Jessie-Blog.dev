import SiteConfig from "@/site.config";

export const getProxiedImageUrl = (url: string) => {
  if (!url) return "/public/images/default.jpg";
  if (!SiteConfig.useImageProxy) return url;

  // 如果已经是 HTTPS，可以选择直接返回
  if (url.startsWith("https://")) {
    return url;
  }

  // 处理相对路径
  if (url.startsWith("/")) {
    return url;
  }

  // 处理 HTTP URL
  if (url.startsWith("http://")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  // 处理其他情况
  try {
    new URL(url);
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  } catch {
    return "/public/images/default.jpg";
  }
};
