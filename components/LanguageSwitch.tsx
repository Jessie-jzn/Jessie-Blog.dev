import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SiteConfig from "@/site.config";
import { useTranslation } from 'next-i18next';

const getInitialLanguage = (
  siteConfigLanguage: string | undefined,
  locale: string | undefined
) => {
  if (locale) return locale; // Use locale from Next.js if available
  if (siteConfigLanguage) return siteConfigLanguage; // Site config language
  return "en"; // Default fallback language
};

const LanguageSwitcher = ({ btnColor = "bg-white" }: { btnColor?: string }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();
  const { i18n } = useTranslation();
  const { locale, locales } = router;

  const [currentLocale, setCurrentLocale] = useState(
    getInitialLanguage(SiteConfig.language, locale)
  );
  useEffect(() => {
    if (locale) {
      setCurrentLocale(locale);
    }
  }, [locale]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // const changeLanguage = (e: any) => {
  //   i18n.changeLanguage(lng);
  //   router.push(router.pathname, router.asPath, { locale: lng });
  //   const selectedLocale = e.target.getAttribute("data-lang");
  //   router.push({ pathname, query }, asPath, { locale: selectedLocale });
  //   // Hide dropdown after selecting a language
  // };

  const changeLanguage = (e: any)=> {
    const selectedLocale = e.target.getAttribute("data-lang");
    i18n.changeLanguage(selectedLocale);
    router.push(router.pathname, router.asPath, { locale: selectedLocale });
    setDropdownVisible(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className={`bg-[${btnColor}] px-4 py-2 rounded-full text-black font-semibold`}
        onClick={toggleDropdown}
      >
        <span className="mr-2">{currentLocale === "en" ? "🇺🇸" : "🇨🇳"}</span>
        {currentLocale === "en" ? "English" : "中文"}
        {/* </button> */}
      </button>
      {dropdownVisible && (
        <div
          className={`origin-top-right z-10 absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-[${btnColor}] ring-1 ring-black ring-opacity-5`}
        >
          {locales?.map((loc) => (
            <div
              key={loc}
              data-lang={loc}
              onClick={changeLanguage}
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

export default LanguageSwitcher;
