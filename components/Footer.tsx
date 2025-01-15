"use client";
import React from "react";
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
    <footer
      className={`box-border w-full border-t border-gray-200 dark:border-zinc-800
      dark:bg-gray-950 bg-gray-50 transition-colors duration-200 ${
        className || ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {t("footer.about")}
            </h2>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300">
              {t("footer.description")}
            </p>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{t("footer.contact")}:</span>
              <a
                href={`mailto:${SiteConfig.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                {SiteConfig.email}
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {t("footer.subscribe")}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              {t("footer.subscribeDesc")}
            </p>
            <NewsletterSubscribe />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center space-y-4">
        <SocialContactIcon
          prop={{
            className: "flex space-x-4 mb-4",
            theme: "dark",
          }}
        />
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>© {new Date().getFullYear()}</span>
          <span>•</span>
          <span>
            {t("footer.builtWith")} {SiteConfig.author}
          </span>
          <span className="animate-pulse">&#128293;</span>
        </div>
        <Link
          href="/"
          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {SiteConfig.title}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
