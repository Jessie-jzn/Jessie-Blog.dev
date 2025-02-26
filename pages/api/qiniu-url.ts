import type { NextApiRequest, NextApiResponse } from "next";
import qiniu from "qiniu";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key } = req.query;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ error: "Key is required" });
  }

  // 初始化七牛云配置
  const accessKey = process.env.QINIU_ACCESS_KEY!;
  const secretKey = process.env.QINIU_SECRET_KEY!;
  const domain = process.env.QINIU_DOMAIN!;

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  // 生成私有下载链接
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1小时有效期
  const privateDownloadUrl = `${domain}/${key}`;
  const signedUrl = qiniu.util.generateAccessToken(
    mac,
    privateDownloadUrl,
    deadline.toString()
  );

  res.status(200).json({ url: `${privateDownloadUrl}?${signedUrl}` });
}
