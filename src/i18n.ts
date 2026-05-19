import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import fr from './locales/fr.json';

const STORAGE_KEY = 'language';

const savedLocale = localStorage.getItem(STORAGE_KEY) || 'fr';

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
  },
});

export function setLocale(locale: 'fr' | 'en') {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}
