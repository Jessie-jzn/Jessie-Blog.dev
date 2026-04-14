import React from "react";
import Link from "next/link";
import SiteConfig from "@/site.config";
import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const { t } = useTranslation("common");

  return (
    <footer
      className={`w-full border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-gray-950 ${className || ""}`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 xs:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* About */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              {t("footer.about")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-4 max-w-md">
              {t("footer.description")}
            </p>
            <a
              href={`mailto:${SiteConfig.email}`}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-[#62BFAD] transition-colors font-light"
            >
              {SiteConfig.email}
            </a>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              {t("footer.subscribe")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-4">
              {t("footer.subscribeDesc")}
            </p>
            <NewsletterSubscribe />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-100 dark:border-gray-800/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex flex-col items-center gap-4">
          <SocialContactIcon
            prop={{
              className: "flex space-x-5",
              theme: "dark",
            }}
          />
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-light">
            <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
            <span className="text-gray-200 dark:text-gray-700">·</span>
            <Link
              href="/"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {SiteConfig.title}
            </Link>
            <span className="text-gray-200 dark:text-gray-700">·</span>
            <span>
              {t("footer.builtWith")} {SiteConfig.author}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
