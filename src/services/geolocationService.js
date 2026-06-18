// Spanish-speaking countries (Spain + Latin America)
const SPANISH_SPEAKING_COUNTRIES = [
  'ES', // Spain
  'MX', // Mexico
  'GT', // Guatemala
  'SV', // El Salvador
  'HN', // Honduras
  'NI', // Nicaragua
  'CR', // Costa Rica
  'PA', // Panama
  'CU', // Cuba
  'DO', // Dominican Republic
  'CO', // Colombia
  'VE', // Venezuela
  'EC', // Ecuador
  'PE', // Peru
  'BO', // Bolivia
  'PY', // Paraguay
  'AR', // Argentina
  'CL', // Chile
  'UY'  // Uruguay
];

const CACHE_KEY = 'petmap_geolocation_language';
const USER_LANGUAGE_KEY = 'petmap_user_language_preference';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const getLanguageFromLocation = async () => {
  try {
    // Check if we have cached language preference
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { language, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return language;
      }
    }

    // Fetch geolocation data
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();

    if (!countryCode) {
      return null;
    }

    // Determine language based on country
    const language = SPANISH_SPEAKING_COUNTRIES.includes(countryCode) ? 'es' : 'en';

    // Cache the result
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        language,
        timestamp: Date.now(),
        countryCode
      })
    );

    return language;
  } catch (error) {
    console.warn('Geolocation service error:', error);
    return null;
  }
};

export const clearGeolocationCache = () => {
  localStorage.removeItem(CACHE_KEY);
};

export const saveUserLanguagePreference = (language) => {
  localStorage.setItem(USER_LANGUAGE_KEY, language);
};

export const getUserLanguagePreference = () => {
  return localStorage.getItem(USER_LANGUAGE_KEY);
};

export const clearUserLanguagePreference = () => {
  localStorage.removeItem(USER_LANGUAGE_KEY);
};
