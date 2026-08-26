'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/30 text-xs font-semibold overflow-hidden ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLanguage('no')}
        aria-pressed={language === 'no'}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          language === 'no' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
        }`}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 transition-colors cursor-pointer ${
          language === 'en' ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
    </div>
  );
}
