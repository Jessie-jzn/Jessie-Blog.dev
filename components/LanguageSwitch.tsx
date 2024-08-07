import { useState } from "react";
import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const changeLanguage = (e) => {
    const selectedLocale = e.target.getAttribute("data-lang");
    router.push({ pathname, query }, asPath, { locale: selectedLocale });
    setDropdownVisible(false); // Hide dropdown after selecting a language
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        <span className="mr-2">{locale === "en" ? "🇺🇸" : "🇨🇳"}</span>
        {locale === "en" ? "English" : "中文"}
      </button>
      {dropdownVisible && (
        <div className="origin-top-right z-10 absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
