"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ReactCusdis } from "react-cusdis";

export interface BlogCommentsProps {
  /** Cusdis page 维度，同一 Notion id 在多语言间共用留言区 */
  pageId: string;
  pageTitle: string;
}

/**
 * Cusdis：访客填写昵称 +（可选）网站即可留言，无需 GitHub 登录。
 * 配置：NEXT_PUBLIC_CUSDIS_APP_ID（在 https://cusdis.com 创建站点后复制）
 * 可选：NEXT_PUBLIC_CUSDIS_HOST 自托管时改为你的域名
 */
const BlogComments: React.FC<BlogCommentsProps> = ({
  pageId,
  pageTitle,
}) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [pageUrl, setPageUrl] = useState("");

  const appId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID;
  const host = process.env.NEXT_PUBLIC_CUSDIS_HOST || "https://cusdis.com";

  useEffect(() => {
    const path = router.asPath.split("#")[0];
    setPageUrl(`${window.location.origin}${path}`);
  }, [router.asPath]);

  /** 仅中文加载语言包；英文走 Cusdis 默认即可 */
  const lang = router.locale?.startsWith("zh") ? "zh-cn" : undefined;

  if (!appId) {
    return (
      <div className="editorial-surface rounded-2xl p-6">
        <p className="text-center text-sm text-subtle">
          {t("comments.notConfigured")}
        </p>
      </div>
    );
  }

  if (!pageUrl) {
    return (
      <div
        className="editorial-surface min-h-[120px] rounded-2xl p-6"
        aria-hidden
      />
    );
  }

  return (
    <section className="editorial-surface rounded-2xl p-5 sm:p-6">
      <h2 className="mb-5 text-lg font-semibold tracking-tight text-ink">
        {t("comments.title")}
      </h2>
      <ReactCusdis
        {...(lang ? { lang } : {})}
        attrs={{
          host,
          appId,
          pageId,
          pageTitle,
          pageUrl,
          theme: "auto",
        }}
      />
    </section>
  );
};

export default BlogComments;
