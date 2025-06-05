export const i18n = {
  defaultLocale: 'tr',
  locales: ['en', 'tr'],
};

export const ns = ['translation']; // Namespace for your translation files
export const defaultNS = 'translation'; // Default namespace to use

export const localePath = typeof window === 'undefined' ? 'public/locales' : 'locales';