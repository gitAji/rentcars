"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';
import type { TranslationKey } from '@/lib/translations';

interface SearchFormProps {
  onSearch: (filters: {
    town?: string;
    passengers?: string;
    carType?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const { t } = useLanguage();
  const [town, setTown] = useState("");
  const [adults, setAdults] = useState("");
  const [children, setChildren] = useState("");
  
  const [carType, setCarType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<TranslationKey | null>(null);

  const [townOptions, setTownOptions] = useState<string[]>([]);
  const [carTypeOptions, setCarTypeOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: townsData, error: townsError } = await supabase
          .from('cars')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select('town', { distinct: true } as any);
        if (townsError) throw townsError;
        setTownOptions(Array.from(new Set(townsData.map(item => item.town?.trim().toLowerCase()).filter(Boolean))));

        const { data: carTypesData, error: carTypesError } = await supabase
          .from('car_types')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .select('name', { distinct: true } as any);
        if (carTypesError) throw carTypesError;
        setCarTypeOptions(carTypesData.map(item => item.name).filter(Boolean));

      } catch (err: unknown) {
        console.error("Error fetching filter options:", err);
        setError('search_error_loading_options');
      }
    };
    fetchFilterOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!town || !startDate || !endDate) {
      setError('search_error_required');
      return;
    }
    setError(null);
    const totalPassengers = (adults ? parseInt(adults) : 0) + (children ? parseInt(children) : 0);

    onSearch({
      ...(town && { town }),
      ...(totalPassengers > 0 && { passengers: totalPassengers.toString() }),
      ...(carType && { carType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white backdrop-blur-sm p-10 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="town" className="sr-only">{t('search_select_town')}</label>
          <select
            id="town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          >
            <option value="">{t('search_select_town')}</option>
            {townOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="adults" className="sr-only">{t('search_adults_placeholder')}</label>
          <input
            id="adults"
            type="number"
            min="1"
            placeholder={t('search_adults_placeholder')}
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="children" className="sr-only">{t('search_children_placeholder')}</label>
          <input
            id="children"
            type="number"
            min="0"
            placeholder={t('search_children_placeholder')}
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="carType" className="sr-only">{t('search_car_type_placeholder')}</label>
          <select
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          >
            <option value="">{t('search_car_type_placeholder')}</option>
            {carTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="sr-only">{t('search_start_date')}</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="sr-only">{t('search_end_date')}</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{t(error)}</p>}

      <button
        type="submit"
        className="btn-primary w-full"
      >
        {t('search_button')}
      </button>
    </form>
  );
}