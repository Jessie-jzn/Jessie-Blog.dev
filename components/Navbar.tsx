import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";

const NavMobile = dynamic(() => import("@/components/NavMobile"));
const ThemeSwitch = dynamic(() => import("@/components/ThemeSwitch"));
const LanguageSwitch = dynamic(() => import("@/components/LanguageSwitch"));

interface NavbarProp {
  btnColor?: string;
  className?: string;
}

type NavLink = { id: string; href: string; title: string };

const Navbar = ({ btnColor, className }: NavbarProp) => {
  const { t } = useTranslation("common");
  const navbarTitle = t("site.title");
  const router = useRouter();

  const navigationLinks = useMemo<NavLink[]>(
    () => [
      { id: "home", href: "/", title: t("nav.home") },
      { id: "whv", href: "/whv", title: t("nav.whv") },
      { id: "travel", href: "/travel", title: t("nav.travel") },
      { id: "life", href: "/life", title: t("nav.life") },
      { id: "technical", href: "/technical", title: t("nav.technical") },
      { id: "about", href: "/about", title: t("nav.about") },
    ],
    [t],
  );

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === "/") return router.asPath === "/";

      const basePath = href.replace(/^\/|\/$/g, "");
      const currentPath = router.asPath.replace(/^\/|\/$/g, "");
      return (
        currentPath === basePath ||
        currentPath.startsWith(`${basePath}/`) ||
        currentPath.startsWith(`${basePath}-`) ||
        currentPath.includes(`/${basePath}-`)
      );
    },
    [router.asPath],
  );

  return (
    <header
      className={[
        "fixed left-0 top-0 z-[999] w-full border-b border-line bg-surface/90 text-ink backdrop-blur-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="site-container flex min-h-14 items-center justify-between gap-4 sm:min-h-16">
        <Link
          href="/"
          aria-label={navbarTitle}
          className="editorial-focus flex items-center rounded-xl"
        >
          <span className="mr-3">
            <Image
              src="https://img.jessieontheroad.com/avatar.png"
              alt="avatar"
              width={192}
              height={192}
              quality={75}
              priority
              className="h-10 w-10 rounded-full xs:h-8 xs:w-8"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight xs:text-sm sm:text-xl">
            {navbarTitle}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary navigation">
            {navigationLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`editorial-focus relative rounded-md py-2 text-sm font-medium transition-colors hover:text-primaryStrong ${
                    isActive ? "text-primaryStrong" : "text-subtle"
                  }`}
                >
                  {link.title}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primaryStrong transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <ThemeSwitch />
          <LanguageSwitch btnColor={btnColor} />
          <div className="block lg:hidden">
            <NavMobile />
          </div>
          <Analytics />
          <SpeedInsights />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
