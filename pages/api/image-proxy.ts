import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NextJS/Image-Proxy)",
      },
    });

    clearTimeout(timeout);

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
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.send(buffer);
  } catch (error) {
    console.error("Image proxy error:", error);

    // 返回默认图片
    return res.redirect("/images/default.webp");
  }
}

export const config = {
  api: {
    responseLimit: "8mb",
  },
};
