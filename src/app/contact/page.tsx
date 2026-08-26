"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "../../components/loading";
import { useLanguage } from "../../context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null); // 'success' or 'error'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real application, you would send this data to your backend
      console.log({ name, email, subject, message });

      setSubmitStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

      return (
    <div className="flex flex-col min-h-screen">
              <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/contact-hero.jpg')" }}
      >
        <Header />
        <div className="absolute inset-0 bg-gray-800 bg-opacity-40" />
        <h1 className="relative z-10 text-4xl md:text-5xl text-gray-800 sm:text-white font-bold">
          {t('contact_hero_title')}
        </h1>
      </section>

                  <main className="bg-secondary flex-grow">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold mb-6 text-primary">{t('contact_get_in_touch')}</h2>
          <p className="mb-6 text-neutral-dark">
            {t('contact_intro')}
          </p>

          <div className="space-y-6">
            {/* Email */}
            <div>
              <h3 className="text-xl font-semibold text-primary">{t('contact_email_label')}</h3>
              <p className="text-neutral-dark">info@rentcars.com</p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-neutral-dark mb-1">
                  {t('contact_name_label')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-neutral-dark mb-1">
                  {t('contact_email_field_label')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-neutral-dark mb-1">
                  {t('contact_subject_label')}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-neutral-dark mb-1">
                  {t('contact_message_label')}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? t('contact_sending') : t('contact_send_button')}
              </button>

              {submitStatus === "success" && (
                <p className="text-green-600 mt-4">
                  {t('contact_success')}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 mt-4">
                  {t('contact_error')}
                </p>
              )}
            </form>
          </div>

          <p className="mt-8 text-neutral">{t('contact_looking_forward')}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}