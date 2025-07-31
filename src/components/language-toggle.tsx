'use client';

import { useLocale } from '@/context/locale-context';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const options: ('en' | 'fr' | 'sw' | 'am')[] = ['en', 'fr', 'sw', 'am'];
  const toggle = () => {
    const idx = options.indexOf(locale);
    setLocale(options[(idx + 1) % options.length]);
  };
  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="mr-2">
      {locale.toUpperCase()}
    </Button>
  );
}
