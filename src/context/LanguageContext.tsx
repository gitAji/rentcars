'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Language, TranslationKey, LANGUAGE_STORAGE_KEY } from '@/lib/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// Norwegian is the default for this Bergen-based rental site.
const DEFAULT_LANGUAGE: Language = 'no';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'no' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — stick with the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore — the choice just won't persist across reloads.
    }
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
    let text: string = translations[language][key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replace(`{${name}}`, String(value));
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
