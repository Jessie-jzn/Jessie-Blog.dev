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
      className={`relative box-border w-full border-t border-gray-200/60 dark:border-zinc-800/60
      dark:bg-gray-950/90 bg-gray-50/90 backdrop-blur-md transition-all duration-300 ${
        className || ""
      }`}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-20 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-20 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-tr from-pink-100/30 via-yellow-100/30 to-blue-100/30 dark:from-pink-900/10 dark:via-yellow-900/10 dark:to-blue-900/10 rounded-full blur-3xl animate-pulse-slow delay-300" />
      </div>

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* About Section */}
          <div className="space-y-4 md:space-y-6 group">
            <div className="relative inline-block">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                {t("footer.about")}
              </h2>
              <div className="absolute -bottom-2 left-0 w-1/3 h-[2px] bg-gradient-to-r from-blue-500/80 to-purple-500/80 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100 duration-500 ease-out" />
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex items-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">
              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm md:text-base">
                {t("footer.contact")}:
              </span>
              <a
                href={`mailto:${SiteConfig.email}`}
                className="relative text-blue-600/90 dark:text-blue-400/90 transition-all group/link text-sm md:text-base"
              >
                <span className="relative z-10 group-hover/link:text-blue-700 dark:group-hover/link:text-blue-300 transition-colors break-all">
                  {SiteConfig.email}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400/80 to-purple-400/80 dark:from-blue-400/60 dark:to-purple-400/60 transform origin-left scale-x-0 transition-transform group-hover/link:scale-x-100 duration-300 ease-out" />
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4 md:space-y-6 group">
            <div className="relative inline-block">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
                {t("footer.subscribe")}
              </h2>
              <div className="absolute -bottom-2 left-0 w-1/3 h-[2px] bg-gradient-to-r from-blue-500/80 to-purple-500/80 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100 duration-500 ease-out" />
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("footer.subscribeDesc")}
            </p>
            <div className="transform transition-all duration-300 hover:scale-[1.01] hover:translate-y-[-2px]">
              <NewsletterSubscribe />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative border-t border-gray-200/40 dark:border-zinc-800/40 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
        <div className="mx-auto px-4 py-4 md:py-6 flex flex-col items-center space-y-3 md:space-y-4">
          <div className="transform transition-all duration-300 hover:scale-105 hover:translate-y-[-2px]">
            <SocialContactIcon
              prop={{
                className: "flex space-x-4 md:space-x-6",
                theme: "dark",
              }}
            />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600/90 dark:text-gray-400/90">
            <span className="font-medium">© {new Date().getFullYear()}</span>
            <span className="text-gray-400/40 dark:text-gray-600/40">•</span>
            <span className="group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
              {t("footer.builtWith")}{" "}
              <span className="font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {SiteConfig.author}
              </span>
            </span>
            <span className="animate-pulse hover:animate-bounce cursor-pointer transition-transform hover:scale-110 select-none">
              &#128293;
            </span>
          </div>
          <Link
            href="/"
            className="relative text-xs md:text-sm text-gray-600/90 dark:text-gray-400/90 transition-all duration-300 hover:-translate-y-0.5 group/link"
          >
            <span className="relative z-10 group-hover/link:text-gray-800 dark:group-hover/link:text-gray-200 transition-colors">
              {SiteConfig.title}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-blue-500/60 transform origin-left scale-x-0 transition-transform group-hover/link:scale-x-100 duration-300 ease-out" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
