'use client';

import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  /** 'light' (default) is for use on dark/translucent backgrounds (the site header/hero).
   *  'dark' is for use on light backgrounds (the admin panel's white header). */
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ className = '', variant = 'light' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const containerClass =
    variant === 'dark'
      ? 'border-gray-300'
      : 'border-white/30';
  const activeClass = variant === 'dark' ? 'bg-primary text-white' : 'bg-white text-gray-900';
  const inactiveClass =
    variant === 'dark'
      ? 'text-gray-600 hover:bg-gray-100'
      : 'text-white hover:bg-white/10';

  return (
    <div
      className={`inline-flex items-center rounded-full border ${containerClass} text-xs font-semibold overflow-hidden ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLanguage('no')}
        aria-pressed={language === 'no'}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          language === 'no' ? activeClass : inactiveClass
        }`}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          language === 'en' ? activeClass : inactiveClass
        }`}
      >
        EN
      </button>
    </div>
  );
}
