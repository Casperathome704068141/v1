'use client';

import { useLocale } from '@/context/locale-context';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const toggle = () => setLocale(locale === 'en' ? 'fr' : 'en');
  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="mr-2">
      {locale === 'en' ? 'FR' : 'EN'}
    </Button>
  );
}
