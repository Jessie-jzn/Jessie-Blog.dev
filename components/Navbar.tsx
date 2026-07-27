import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  isFull?: boolean;
  currentTheme?: "light" | "dark";
}

type NavLink = { id: string; href: string; title: string };

const Navbar = ({
  btnColor,
  className,
  currentTheme = "light",
  isFull = false,
}: NavbarProp) => {
  const { t } = useTranslation("common");
  const navbarTitle = t("site.title");
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isFull) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFull]);

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

  const showSolidBg = !isFull || scrolled;
  const textColor = showSolidBg
    ? "text-ink"
    : currentTheme === "dark"
      ? "text-white"
      : "text-ink";
  const activeTextColor = showSolidBg
    ? "text-primaryStrong"
    : currentTheme === "dark"
      ? "text-white"
      : "text-primaryStrong";
  const hoverTextColor = !showSolidBg && currentTheme === "dark"
    ? "hover:text-white"
    : "hover:text-primaryStrong";
  const underlineColor = !showSolidBg && currentTheme === "dark"
    ? "bg-white"
    : "bg-primaryStrong";
  const overlayControlSurface = currentTheme === "dark"
    ? "!border-white/30 !bg-black/20 !text-white hover:!bg-black/30"
    : "!border-black/15 !bg-white/80 !text-ink hover:!bg-white";
  const controlSurface = btnColor ?? (!showSolidBg ? overlayControlSurface : undefined);

  return (
    <header
      className={[
        "fixed left-0 top-0 z-[999] w-full border-b border-line transition-colors duration-300",
        showSolidBg ? "bg-surface/90 backdrop-blur-xl" : "bg-transparent backdrop-blur-sm",
        textColor,
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
                  className={`editorial-focus relative rounded-md py-2 text-sm font-medium transition-colors ${hoverTextColor} ${
                    isActive ? activeTextColor : showSolidBg ? "text-subtle" : textColor
                  }`}
                >
                  {link.title}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${underlineColor} transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <ThemeSwitch className={controlSurface} />
          <LanguageSwitch btnColor={controlSurface} />
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
