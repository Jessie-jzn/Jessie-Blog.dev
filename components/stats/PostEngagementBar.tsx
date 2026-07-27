import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

type Overview = {
  views: number;
  viewsEnabled: boolean;
  subscribers: number | null;
};

function formatNum(n: number, locale?: string) {
  try {
    return new Intl.NumberFormat(
      locale === "zh" ? "zh-CN" : "en-US"
    ).format(n);
  } catch {
    return String(n);
  }
}

interface PostEngagementBarProps {
  postId: string;
}

/**
 * 文章页底部统计：记入浏览（同源 session 去重），并展示本站订阅人数。
 */
const PostEngagementBar: React.FC<PostEngagementBarProps> = ({ postId }) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    if (!postId) return;

    const sessionKey = `post_pv:${postId}`;

    (async () => {
      try {
        if (
          typeof window !== "undefined" &&
          !sessionStorage.getItem(sessionKey)
        ) {
          await fetch("/api/stats/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
          });
          sessionStorage.setItem(sessionKey, "1");
        }

        const r = await fetch(
          `/api/stats/overview?postId=${encodeURIComponent(postId)}`
        );
        if (!r.ok) return;
        const j = (await r.json()) as Overview;
        setData(j);
      } catch {
        setData(null);
      }
    })();
  }, [postId]);

  if (!postId || !data) return null;

  const showReads = data.viewsEnabled;
  const showSubs =
    typeof data.subscribers === "number" && data.subscribers >= 0;

  if (!showReads && !showSubs) return null;

  return (
    <div
      className="editorial-surface flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl px-4 py-3 text-xs text-subtle"
      aria-live="polite"
    >
      {showReads ? (
        <span>
          {t("stats.reads", {
            countDisplay: formatNum(data.views, locale),
          })}
        </span>
      ) : null}
      {showReads && showSubs ? (
        <span className="text-line" aria-hidden>
          ·
        </span>
      ) : null}
      {showSubs ? (
        <span>
          {t("stats.subscribersBlog", {
            countDisplay: formatNum(data.subscribers as number, locale),
          })}
        </span>
      ) : null}
    </div>
  );
};

export default PostEngagementBar;
