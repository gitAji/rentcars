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
      className="bg-white backdrop-blur-sm p-4 sm:p-6 lg:p-4 rounded-2xl shadow-xl w-full max-w-4xl lg:max-w-6xl border border-gray-200"
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-3">
        <div className="flex-1 min-w-0">
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

        <div className="flex-1 min-w-0">
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

        <div className="flex-1 min-w-0">
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

        <div className="flex-1 min-w-0">
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

        <div className="flex-1 min-w-0">
          <label htmlFor="startDate" className="sr-only">{t('search_start_date')}</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <label htmlFor="endDate" className="sr-only">{t('search_end_date')}</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5757] text-gray-900 w-full"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full lg:w-auto lg:shrink-0 lg:px-8 whitespace-nowrap"
        >
          {t('search_button')}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{t(error)}</p>}
    </form>
  );
}