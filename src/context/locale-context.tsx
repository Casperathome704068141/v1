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
  sw: {
    preview: 'Mwoneko',
    copyLink: 'Nakili Kiungo',
    copied: 'Imenakiliwa',
  },
  am: {
    preview: '\u12A0\u12CD\u121D',
    copyLink: '\u12A0\u1295\u1235\u1276\u12ED \u1203\u1295\u130D',
    copied: '\u1295\u12ED\u1295\u122D',
  },
};

interface LocaleContextValue {
  locale: 'en' | 'fr' | 'sw' | 'am';
  setLocale: (loc: 'en' | 'fr' | 'sw' | 'am') => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => translations.en[key],
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'en' | 'fr' | 'sw' | 'am'>('en');
  const t = (key: keyof typeof translations['en']) => translations[locale][key] || key;
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
