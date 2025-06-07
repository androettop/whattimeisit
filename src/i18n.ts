import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import it from "./locales/it.json";

const supportedLanguages = ["en", "es"];

const browserLanguage = navigator.language.split("-")[0];

const defaultLanguage = supportedLanguages.includes(browserLanguage) ? browserLanguage : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    it: { translation: it },
  },
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
