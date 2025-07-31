'use client';

import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    preview: 'Preview',
    copyLink: 'Copy Link',
    copied: 'Copied',
  },
  fr: {
    preview: 'Aperçu',
    copyLink: 'Copier le lien',
    copied: 'Copié',
  },
};

interface LocaleContextValue {
  locale: 'en' | 'fr';
  setLocale: (loc: 'en' | 'fr') => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => translations.en[key],
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en' | 'fr'>('en');
  const t = (key: keyof typeof translations['en']) => translations[locale][key] || key;
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
