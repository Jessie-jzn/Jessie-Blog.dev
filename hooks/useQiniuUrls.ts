import { useState, useEffect } from "react";

interface QiniuUrlCache {
  [key: string]: {
    url: string;
    expireTime: number;
  };
}

const urlCache: QiniuUrlCache = {};
const BUFFER_TIME = 300; // 5分钟的缓冲时间，提前更新即将过期的URL

export function useQiniuUrls(keys: string[]) {
  const [urls, setUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const keysToFetch = keys.filter((key) => {
        const cached = urlCache[key];
        return !cached || cached.expireTime - currentTime < BUFFER_TIME;
      });

      if (keysToFetch.length === 0) {
        // 如果所有URL都在缓存中且未过期，直接使用缓存
        const cachedUrls = keys.reduce((acc, key) => {
          acc[key] = urlCache[key].url;
          return acc;
        }, {} as { [key: string]: string });
        setUrls(cachedUrls);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/qiniu-urls?keys=${encodeURIComponent(
            JSON.stringify(keysToFetch)
          )}`
        );
        const data = await response.json();

        // 更新缓存
        Object.entries(data.urls).forEach(([key, urlData]: [string, any]) => {
          urlCache[key] = {
            url: urlData.url,
            expireTime: urlData.expireTime,
          };
        });

        // 合并新获取的URL和缓存的URL
        const newUrls = keys.reduce((acc, key) => {
          acc[key] = urlCache[key].url;
          return acc;
        }, {} as { [key: string]: string });

        setUrls(newUrls);
      } catch (error) {
        console.error("Error fetching Qiniu URLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [JSON.stringify(keys)]); // 当keys数组变化时重新获取

  return { urls, loading };
}
