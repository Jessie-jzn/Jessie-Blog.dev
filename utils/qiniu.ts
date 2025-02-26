import qiniu from "qiniu";

// 初始化七牛云配置
const accessKey = process.env.QINIU_ACCESS_KEY!;
const secretKey = process.env.QINIU_SECRET_KEY!;
const bucket = process.env.QINIU_BUCKET!;
const domain = process.env.QINIU_DOMAIN!;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();

/**
 * 生成私有空间文件的临时访问链接
 * @param key 文件在七牛云中的键值
 * @param expireSeconds 链接的有效期（秒）
 * @returns 临时访问链接
 */
export function getPrivateDownloadUrl(
  key: string,
  expireSeconds: number = 3600
): string {
  const deadline = Math.floor(Date.now() / 1000) + expireSeconds;

  // 生成私有下载链接
  const privateDownloadUrl = `${domain}/${key}`;
  const signedUrl = qiniu.util.generateAccessToken(
    mac,
    privateDownloadUrl,
    deadline.toString()
  );

  return `${privateDownloadUrl}?${signedUrl}`;
}
