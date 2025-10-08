import { DEFAULT_LANG, useAppStore } from "@/store/useAppStore";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en.json";
import translationHi from "./locales/hi.json";
import translationMr from "./locales/mr.json";

const resources = {
  en: { translation: translationEn },
  hi: { translation: translationHi },
  mr: { translation: translationMr },
} as const;

export type I_LANGUAGE = keyof typeof resources;

const initI18n = async () => {
  let savedLanguage = useAppStore.getState().lang;
  const languageCode =
    Localization.getLocales()[0].languageCode || DEFAULT_LANG;

  if (!savedLanguage) {
    savedLanguage = (
      Object.keys(resources).includes(languageCode)
        ? languageCode
        : DEFAULT_LANG
    ) as I_LANGUAGE;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
