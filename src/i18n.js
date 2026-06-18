import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getLanguageFromLocation } from './services/geolocationService';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES }
};

// Custom detector for geolocation-based language detection
const geolocationDetector = {
  type: 'backend',
  async: true,
  init: () => {},
  detect: async (callback) => {
    const language = await getLanguageFromLocation();
    if (language) {
      callback(language);
    } else {
      callback(null);
    }
  }
};

i18n
  // Add geolocation detector first (highest priority)
  .use(geolocationDetector)
  // Detects user language from the browser
  .use(LanguageDetector)
  // Passes i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Sets Spanish as the default if detection fails
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;