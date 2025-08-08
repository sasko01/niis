import i18n from "i18next";
import {initReactI18next}  from "react-i18next";
import en from "./languages/en.json";
import si from "./languages/si.json";
import it from "./languages/it.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      si: { translation: si },
      it: { translation: it }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;