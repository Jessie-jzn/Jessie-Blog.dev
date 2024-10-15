// context/LanguageContext.js
import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext({
  language: "zh",
  changeLanguage: (lang: string) => {
    console.log("lang", lang);
  },
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: any) => {
  const [language, setLanguage] = useState("zh");

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
