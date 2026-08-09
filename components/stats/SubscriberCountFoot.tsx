/** 获取并按当前语言格式化展示 Mailchimp 订阅人数。 */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function formatNum(n: number, locale?: string) {
  try {
    return new Intl.NumberFormat(
      locale === "zh" ? "zh-CN" : "en-US"
    ).format(n);
  } catch {
    return String(n);
  }
}

/** 页脚订阅区：展示 Mailchimp 列表当前人数（与订阅表单打通同一数据源）。 */
const SubscriberCountFoot: React.FC = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [count, setCount] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/stats/subscribers");
        const j = (await r.json()) as { count: number | null };
        if (!cancelled) setCount(j.count);
      } catch {
        if (!cancelled) setCount(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === undefined || count === null) return null;

  return (
    <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
      {t("stats.subscribersFoot", {
        countDisplay: formatNum(count, locale),
      })}
    </p>
  );
};

export default SubscriberCountFoot;
