import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend'; // Import the backend
import LanguageDetector from 'i18next-browser-languagedetector'; // Add language detector

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: ['translation', 'home/banner', 'home/information', 'home/aboutUsSection', 'home/onlineCourses', 'home/trendingCategories', 'home/whyChooseUs', 'home/counter', 'home/testimonial', 'home/upcomingEvents'],
    defaultNS: 'translation',
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    // Optional: Enable debug mode
    // debug: true,
  });

export default i18n;
