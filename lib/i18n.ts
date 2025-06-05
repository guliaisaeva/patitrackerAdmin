import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "tr", // Fallback language if the user language is not available
    lng: "tr", // Default language
    ns: ["translation"], // Namespace for translation keys
    defaultNS: "translation", // Default namespace
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: "/locales/{{lng}}.json", // Path to translation files
    },
    react: {
      useSuspense: false, // Set to false if you don't want to use React Suspense
    },
  });

export default i18n;
