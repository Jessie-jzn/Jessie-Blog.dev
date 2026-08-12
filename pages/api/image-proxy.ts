/**
 * 文章图片代理接口：校验远程 URL、阻止内网访问并转发图片，失败时返回本地兜底图。
 */
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { readFile } from "node:fs/promises";
import { lookup } from "node:dns/promises";
import path from "node:path";
import {
  ARTICLE_IMAGE_FALLBACK,
  isPrivateNetworkAddress,
  validateRemoteImageUrl,
} from "@/lib/images/articleImageSource";

async function sendFallback(res: NextApiResponse) {
  const fallback = await readFile(
    path.join(process.cwd(), "public", ARTICLE_IMAGE_FALLBACK)
  );
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
  return res.status(200).send(fallback);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return sendFallback(res);
  }

  const remoteUrl = validateRemoteImageUrl(url);
  if (!remoteUrl) {
    return sendFallback(res);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const resolvedAddresses = await lookup(remoteUrl.hostname, {
      all: true,
      verbatim: true,
    });
    if (
      resolvedAddresses.length === 0 ||
      resolvedAddresses.some(({ address }) =>
        isPrivateNetworkAddress(address)
      )
    ) {
      throw new Error("Private image targets are not allowed");
    }

    const response = await fetch(remoteUrl, {
      signal: controller.signal,
      redirect: "error",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NextJS/Image-Proxy)",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const buffer = await response.buffer();
    const contentType = response.headers.get("content-type");

    // 验证内容类型
    if (!contentType?.startsWith("image/")) {
      throw new Error("Invalid content type");
    }

    // 设置缓存和内容类型头
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=60"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.send(buffer);
  } catch (error) {
    console.error("Image proxy error:", error);
    return sendFallback(res);
  } finally {
    clearTimeout(timeout);
  }
}

export const config = {
  api: {
    responseLimit: "8mb",
  },
};
