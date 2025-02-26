import type { NextApiRequest, NextApiResponse } from "next";
import qiniu from "qiniu";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { keys } = req.query;

  if (!keys || typeof keys !== "string") {
    return res.status(400).json({ error: "Keys are required" });
  }

  try {
    const keyArray = JSON.parse(keys) as string[];

    // 初始化七牛云配置
    const accessKey = process.env.QINIU_ACCESS_KEY!;
    const secretKey = process.env.QINIU_SECRET_KEY!;
    const domain = process.env.QINIU_DOMAIN!;

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    // 生成私有下载链接
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时有效期
    const urls = keyArray.reduce((acc, key) => {
      const privateDownloadUrl = `${domain}/${key}`;
      const signedUrl = qiniu.util.generateAccessToken(
        mac,
        privateDownloadUrl,
        deadline.toString()
      );

      acc[key] = {
        url: `${privateDownloadUrl}?${signedUrl}`,
        expireTime: deadline,
      };
      return acc;
    }, {} as { [key: string]: { url: string; expireTime: number } });

    res.status(200).json({ urls });
  } catch (error) {
    res.status(400).json({ error: "Invalid keys format" });
  }
}
