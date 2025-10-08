// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import en from "@/i18n/locales/en.json";
import hi from "@/i18n/locales/hi.json";
import mr from "@/i18n/locales/mr.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "en";
    // custom resources type
    resources: {
      en: typeof en;
      hi: typeof hi;
      mr: typeof mr;
    };
    // other
  }
}
