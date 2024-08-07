// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nextI18NextConfig from "./next-i18next.config";
import en from "./public/locales/en/common.json";
import zh from "./public/locales/zh/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  fallbackLng: nextI18NextConfig.i18n.defaultLocale,
  lng: nextI18NextConfig.i18n.defaultLocale,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
