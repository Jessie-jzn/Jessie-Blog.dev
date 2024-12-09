"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteConfig from "@/site.config";
import { useRouter } from "next/router";

import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    <div
      className={`box-border flex flex-col p-10 items-center w-full border-[#E8E8EA] dark:border-zinc-900 dark:bg-gray-950 bg-gray-100 ${
        className || ""
      }`}
    >
      {router.pathname !== "/" && (
        <div className="flex flex-wrap justify-around w-full max-w-screen-xl px-4">
          <div className="flex flex-col xs:max-w-xs mb-2 xs:mb-4">
            <h2 className="text-xl lg:text-4xl font-bold">{t("about")}</h2>
            <p className="mt-2 md:text-xl">{SiteConfig.description}</p>
            <p className="mt-4 md:text-xl">
              <strong>{t("contact")} :</strong> {SiteConfig.email}
            </p>
          </div>
          <div className="flex flex-col mb-2 xs:mb-4">
            <h2 className="text-xl lg:text-4xl font-bold">{t("subscribe")}</h2>
            <p className="mt-2 text-sm">{t("subscribeDesc")}</p>
            <NewsletterSubscribe />
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center">
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
