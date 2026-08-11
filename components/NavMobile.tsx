"use client";

/** 提供支持路由高亮和 common i18n 文案的移动端展开式导航。 */
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "./Link";
import SiteConfig from "@/site.config";
import { useTranslation } from "next-i18next";

const mobileMenuId = "mobile-navigation-menu";

const NavMobile = () => {
  const [navShow, setNavShow] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  const onToggleNav = () => {
    setNavShow((status) => {
      document.body.style.overflow = status ? "auto" : "hidden";
      return !status;
    });
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return router.asPath === "/";

    const basePath = href.replace(/^\/|\/$/g, "");
    const currentPath = router.asPath.replace(/^\/|\/$/g, "");
    return (
      currentPath === basePath ||
      currentPath.startsWith(`${basePath}/`) ||
      currentPath.startsWith(`${basePath}-`) ||
      currentPath.includes(`/${basePath}-`)
    );
  };

  return (
    <>
      <button
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        aria-controls={mobileMenuId}
        onClick={onToggleNav}
        className="editorial-focus inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-primarySoft lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id={mobileMenuId}
        aria-hidden={!navShow}
        className={`fixed inset-0 z-[1000] transform border-b border-line bg-surface/95 text-ink backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          navShow
            ? "visible translate-x-0"
            : "invisible pointer-events-none translate-x-full"
        }`}
      >
        <div className="site-container flex min-h-14 justify-end sm:min-h-16">
          <button
            className="editorial-focus inline-flex h-10 w-10 items-center justify-center self-center rounded-xl border border-line bg-surface text-ink transition-colors hover:bg-primarySoft"
            aria-label="Toggle Menu"
            onClick={onToggleNav}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="site-container mt-8" aria-label="Mobile navigation">
          {SiteConfig.navigationLinks?.map((link: any) => {
            const isActive = isActiveLink(link.href);

            return (
              <div key={link.title} className="border-b border-line">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`editorial-focus flex min-h-14 items-center rounded-md text-xl font-semibold tracking-tight transition-colors ${
                    isActive ? "text-primaryStrong" : "text-ink hover:text-primaryStrong"
                  }`}
                  onClick={onToggleNav}
                >
                  <span className="relative">
                    {t(link.title)}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primaryStrong"
                      />
                    )}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default NavMobile;
