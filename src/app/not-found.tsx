'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import { FaMapSigns } from 'react-icons/fa';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center">
        <div className="w-full max-w-lg mx-auto">
          <EmptyState
            icon={FaMapSigns}
            title={`404 – ${t('notfound_title')}`}
            message={t('notfound_message')}
            actionLabel={t('notfound_button')}
            actionHref="/"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
