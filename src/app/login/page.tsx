'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/stavanger.jpg')" }}
      >
        <Header />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl text-white font-bold">
          {t('login_hero_title')}
        </h1>
      </section>
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-4">
              <FaLock size={22} />
            </div>
            <h2 className="text-2xl font-bold text-center text-primary">{t('login_welcome')}</h2>
            <p className="text-sm text-neutral-light text-center mt-1">
              {t('login_subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                {t('login_email_label')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-1">
                {t('login_password_label')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? t('login_hide_password') : t('login_show_password')}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? t('login_logging_in') : t('login_button')}
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-neutral-dark">
            {t('login_no_account')}{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              {t('login_signup_link')}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
