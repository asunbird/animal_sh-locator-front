import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetectorClass from 'i18next-browser-languagedetector';
import { getLanguageFromLocation, saveUserLanguagePreference, getUserLanguagePreference } from './services/geolocationService';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES }
};

// Create a LanguageDetector instance
const languageDetector = new LanguageDetectorClass();

// User language preference detector - highest priority, checks manual selection first
const userLanguageDetector = {
  name: 'userLanguage',
  lookup() {
    return getUserLanguagePreference();
  },
  cacheUserLanguage(lng) {
    saveUserLanguagePreference(lng);
  }
};

// Geolocation detector - synchronous lookup using cached result
const geolocationDetector = {
  name: 'geolocation',
  lookup() {
    const cached = localStorage.getItem('petmap_geolocation_language');
    if (cached) {
      try {
        const { language, timestamp } = JSON.parse(cached);
        const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < CACHE_DURATION) {
          return language;
        }
      } catch (e) {
        console.warn('Failed to parse cached geolocation language:', e);
      }
    }
    return undefined;
  },
  cacheUserLanguage(lng) {
    try {
      const cached = localStorage.getItem('petmap_geolocation_language');
      const countryCode = cached ? JSON.parse(cached).countryCode : 'UNKNOWN';
      localStorage.setItem('petmap_geolocation_language', JSON.stringify({
        language: lng,
        timestamp: Date.now(),
        countryCode
      }));
    } catch (e) {
      console.warn('Failed to cache language:', e);
    }
  }
};

// Add custom detectors to the instance
languageDetector.addDetector(userLanguageDetector);
languageDetector.addDetector(geolocationDetector);

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    detection: {
      order: ['userLanguage', 'geolocation', 'navigator', 'localStorage'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

// Save user's manual language selection when they change it
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  saveUserLanguagePreference(lng);
});

// Helper function to change language and save preference
export const changeLanguageAndSave = (lang) => {
  saveUserLanguagePreference(lang);
  i18n.changeLanguage(lang);
};

// Fetch geolocation and update i18n language asynchronously (only if no user preference)
getLanguageFromLocation().then(language => {
  if (language && language !== i18n.language) {
    const userPref = getUserLanguagePreference();
    if (!userPref) {
      i18n.changeLanguage(language);
    }
  }
});

export default i18n;