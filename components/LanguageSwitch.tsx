import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import SiteConfig from "@/site.config";

/** Next.js i18n 用于记住用户所选语言的 Cookie 名（与框架约定一致）。 */
function persistLocalePreference(locale: string) {
  if (typeof document === "undefined") return;
  const maxAgeSeconds = 60 * 60 * 24 * 365;
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${maxAgeSeconds};SameSite=Lax`;
}

const getInitialLanguage = (
  siteConfigLanguage: string | undefined,
  locale: string | undefined
) => {
  if (locale) return locale; // Use locale from Next.js if available
  if (siteConfigLanguage) return siteConfigLanguage; // Site config language
  return "en"; // 与 defaultLocale 一致
};

/** `btnColor` 可以是 Tailwind 类（如 bg-white）或十六进制背景色（如 #d3d58c）。 */
function surfaceStyles(btnColor: string): {
  className: string;
  style?: React.CSSProperties;
} {
  if (btnColor.startsWith("#")) {
    return {
      className: "",
      style: { backgroundColor: btnColor },
    };
  }
  return { className: btnColor };
}

const LanguageSwitcher = ({ btnColor = "bg-white" }: { btnColor?: string }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();
  const { pathname, query, asPath, locale, locales } = router;
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentLocale, setCurrentLocale] = useState(
    getInitialLanguage(SiteConfig.language, locale)
  );
  const triggerSurface = surfaceStyles(btnColor);
  const menuSurface = surfaceStyles(btnColor);

  useEffect(() => {
    if (locale) {
      setCurrentLocale(locale);
    }
  }, [locale]);

  useEffect(() => {
    setDropdownVisible(false);
  }, [locale, pathname]);

  useEffect(() => {
    if (!dropdownVisible) return;
    const onDocMouseDown = (ev: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(ev.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [dropdownVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLanguageChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const selectedLocale = e.currentTarget.getAttribute("data-lang");
      if (
        !selectedLocale ||
        selectedLocale === locale ||
        !(locales || []).includes(selectedLocale)
      ) {
        setDropdownVisible(false);
        return;
      }

      persistLocalePreference(selectedLocale);
      void router.push(
        { pathname, query },
        asPath,
        { locale: selectedLocale, scroll: false }
      );
      setDropdownVisible(false);
      setCurrentLocale(selectedLocale);
    },
    [asPath, locale, locales, pathname, query, router]
  );

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div
        className={`${triggerSurface.className} text-black font-semibold h-8 w-8 rounded hover:bg-gray-200 flex align-middle items-center justify-center cursor-pointer`}
        style={triggerSurface.style}
        onClick={toggleDropdown}
      >
        {currentLocale === "en" ? "🇺🇸" : "🇨🇳"}
        {/* <span className="xs:hidden">
          {currentLocale === "en" ? "English" : "中文"}
        </span> */}
        {/* </button> */}
      </div>
      {dropdownVisible && (
        <div
          className={`${menuSurface.className} origin-top-right z-10 absolute right-0 mt-2 min-w-[8rem] rounded-md shadow-lg ring-1 ring-black ring-opacity-5`}
          style={menuSurface.style}
        >
          {locales?.map((loc) => (
            <div
              key={loc}
              data-lang={loc}
              onClick={handleLanguageChange}
              className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
            >
              <span className="mr-2">{loc === "en" ? "🇺🇸" : "🇨🇳"}</span>
              {loc === "en" ? "English" : "中文"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(LanguageSwitcher);
