import React from "react";
import Link from "next/link";
import SiteConfig from "@/site.config";
import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import SubscriberCountFoot from "@/components/stats/SubscriberCountFoot";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const { t } = useTranslation("common");

  return (
    <footer
      className={`w-full border-t border-line bg-muted text-ink ${className || ""}`}
    >
      <div className="site-container py-12 xs:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-ink">
              {t("footer.about")}
            </h3>
            <p className="mb-4 max-w-md text-sm font-light leading-relaxed text-subtle">
              {t("footer.description")}
            </p>
            <a
              href={`mailto:${SiteConfig.email}`}
              className="editorial-focus text-sm font-light text-subtle transition-colors hover:text-primaryStrong"
            >
              {SiteConfig.email}
            </a>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-ink">
              {t("footer.subscribe")}
            </h3>
            <p className="mb-4 text-sm font-light leading-relaxed text-subtle">
              {t("footer.subscribeDesc")}
            </p>
            <NewsletterSubscribe />
            <SubscriberCountFoot />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-line">
        <div className="site-container flex flex-col items-center gap-4 py-6">
          <SocialContactIcon
            prop={{
              className: "flex space-x-5",
              theme: "dark",
            }}
          />
          <div className="flex items-center gap-2 text-xs font-light text-subtle">
            <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
            <span className="text-subtle/60">·</span>
            <Link
              href="/"
              className="editorial-focus transition-colors hover:text-primaryStrong"
            >
              {t("site.title")}
            </Link>
            <span className="text-subtle/60">·</span>
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
