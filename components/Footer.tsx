"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteConfig from "@/site.config";
import { useRouter } from "next/router";
import { subscribeToNewsletter } from "@/lib/mailchimp";

import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = useCallback(
    async (event: any) => {
      event.preventDefault(); // 阻止页面刷新
      if (emailRef.current) {
        const email = emailRef.current.value;
        if (email) {
          try {
            const response = await subscribeToNewsletter(email);
            console.log("Subscription succeeded:", response);
            // 在此处添加成功订阅后的操作
            if (response.success) {
              setMessage(t("subscriptionSuccess")); // 设置成功消息
              emailRef.current.value = ""; // 清空输入框
            } else {
              setMessage(response.message);
            }
          } catch (error) {
            console.error("Subscription failed:", error);
            // 在此处添加订阅失败后的操作
            setMessage(t("subscriptionFailed")); // 设置失败消息
          } finally {
            setIsSubmitting(false); // 重新启用按钮
          }
        } else {
          setMessage(t("emailRequired")); // 设置提示消息
        }
      }
    },
    [t]
  );

  useEffect(() => {
    const form = formRef.current;
    form?.addEventListener("submit", handleSubscribe);
    return () => {
      form?.removeEventListener("submit", handleSubscribe);
    };
  }, [handleSubscribe]);

  return (
    <div className="box-border flex flex-col p-10 items-center w-full border-[#E8E8EA] dark:border-zinc-900 dark:bg-gray-950 bg-gray-100">
      {router.pathname !== "/" && (
        <div className="flex flex-wrap justify-around w-full max-w-screen-xl px-4">
          <div className="flex flex-col xs:max-w-xs mb-2 xs:mb-4">
            <h2 className="text-xl lg:text-4xl font-bold ">
              {t("about")}
            </h2>
            <p className="mt-2 md:text-xl">
              {SiteConfig.description}
            </p>
            <p className="mt-4 md:text-xl ">
              <strong>{t("contact")} :</strong> {SiteConfig.email}
            </p>
          </div>

          <div className="flex flex-col mb-2 xs:mb-4">
            <h2 className="text-xl lg:text-4xl font-bold">
              {t("subscribe")}
            </h2>
            <p className="mt-2 text-sm ">
              {t("subscribeDesc")}
            </p>
            <form className="rounded-2xl" ref={formRef}>
              <div className="mt-6 flex">
                <input
                  type="email"
                  ref={emailRef}
                  placeholder="Email address"
                  disabled={isSubmitting} // 输入框禁用
                  className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
                />
                <button
                  className="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 ml-4 flex-none"
                  type="submit"
                >
                  {isSubmitting ? (
                    <span className="loader"></span> // 显示加载指示器
                  ) : (
                    t("subscribe")
                  )}
                </button>
              </div>
            </form>
            {message && (
              <p className="mt-4 text-sm">
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center ">
        <SocialContactIcon
          prop={{ className: "mb-3 flex space-x-4", theme: "dark" }}
        />
        <div className="mb-2 flex space-x-2 text-sm">
          © {new Date().getFullYear()}
          {` • `} Built with {SiteConfig.author} &#128293;{" "}
        </div>
        <div className="mb-8 text-sm">
          <Link href="/">{SiteConfig.title}</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
