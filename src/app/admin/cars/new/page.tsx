'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Image from 'next/image';
import { getErrorMessage } from '@/lib/errorMessage';
import { useLanguage } from '@/context/LanguageContext';

function NewCarPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [town, setTown] = useState('');
  const [passengers, setPassengers] = useState<number | ''>('');
  const [carType, setCarType] = useState('');
  const [seats, setSeats] = useState<number | ''>('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>([]);
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [color, setColor] = useState('');
  const [doors, setDoors] = useState<number | ''>('');
  const [extraKmCharge, setExtraKmCharge] = useState<number | ''>('');
  const [fuelMissingCharge, setFuelMissingCharge] = useState<number | ''>('');
  const [scratchCharge, setScratchCharge] = useState<number | ''>('');
  const [damagePolicy, setDamagePolicy] = useState('');
  const [accidentProcedure, setAccidentProcedure] = useState('');
  const [glassCoverPolicy, setGlassCoverPolicy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const norwegianTowns = ["Oslo", "Bergen", "Stavanger", "Trondheim", "Tromsø", "Kristiansand", "Fredrikstad", "Sandnes", "Drammen", "Porsgrunn"];
  const passengerOptions = [2, 4, 5, 7];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const doorOptions = [2, 3, 4, 5];

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFeatures([...features, value]);
    } else {
      setFeatures(features.filter((feature) => feature !== value));
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMainImage(file);
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
    } else {
      setMainImagePreview(null);
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setOtherImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setOtherImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveOtherImage = (indexToRemove: number) => {
    setOtherImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setOtherImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) {
      setError(t('admin_please_select_main_image'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload main image
      const mainImageFileName = `${Date.now()}-${mainImage.name}`;
      const { data: mainImageData, error: mainImageError } = await supabase.storage
        .from('car_images')
        .upload(mainImageFileName, mainImage);

      if (mainImageError) throw mainImageError;

      const { data: { publicUrl: mainPublicUrl } } = supabase.storage.from('car_images').getPublicUrl(mainImageData.path);

      // 2. Upload other images
      const otherPublicUrls: string[] = [];
      if (otherImages.length > 0) {
        const uploadPromises = otherImages.map(file => {
          const fileName = `${Date.now()}-${file.name}`;
          return supabase.storage.from('car_images').upload(fileName, file);
        });

        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach(result => {
          if (result.error) throw result.error;
          const { data: { publicUrl } } = supabase.storage.from('car_images').getPublicUrl(result.data.path);
          otherPublicUrls.push(publicUrl);
        });
      }

      // 3. Insert car data into the database
      const { error: insertError } = await supabase.from('cars').insert([{
        make,
        model,
        year,
        price,
        town,
        passengers,
        car_type: carType,
        seats,
        short_description: shortDescription,
        description,
        terms,
        features,
        image_url: mainPublicUrl,
        image_urls: [mainPublicUrl, ...otherPublicUrls],
        transmission,
        fuel_type: fuelType,
        color,
        doors,
        extra_km_charge: extraKmCharge === '' ? null : extraKmCharge,
        fuel_missing_charge: fuelMissingCharge === '' ? null : fuelMissingCharge,
        scratch_charge: scratchCharge === '' ? null : scratchCharge,
        damage_policy: damagePolicy || null,
        accident_procedure: accidentProcedure || null,
        glass_cover_policy: glassCoverPolicy || null,
      }]);

      if (insertError) throw insertError;

      alert(t('admin_car_added_alert'));
      router.push('/admin');

    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('admin_add_car_page_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">{t('admin_field_make')}</label>
            <input type="text" id="make" value={make} onChange={(e) => setMake(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">{t('admin_field_model')}</label>
            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">{t('admin_field_year')}</label>
            <select id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_year')}</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('admin_field_price')}</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700">{t('admin_field_town')}</label>
            <select id="town" value={town} onChange={(e) => setTown(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_town')}</option>
              {norwegianTowns.map(tw => <option key={tw} value={tw}>{tw}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">{t('admin_field_passengers')}</label>
            <select id="passengers" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_passengers')}</option>
              {passengerOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="carType" className="block text-sm font-medium text-gray-700">{t('admin_field_car_type')}</label>
            <select id="carType" value={carType} onChange={(e) => setCarType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_car_type')}</option>
              <option value="Sedan">{t('admin_cartype_sedan')}</option>
              <option value="SUV">{t('admin_cartype_suv')}</option>
              <option value="Hatchback">{t('admin_cartype_hatchback')}</option>
              <option value="Electric">{t('admin_cartype_electric')}</option>
              <option value="Van">{t('admin_cartype_van')}</option>
              <option value="Compact">{t('admin_cartype_compact')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700">{t('admin_field_seats')}</label>
            <select id="seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_seats')}</option>
              {passengerOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">{t('admin_field_transmission')}</label>
            <select id="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_transmission')}</option>
              <option value="Automatic">{t('admin_transmission_automatic')}</option>
              <option value="Manual">{t('admin_transmission_manual')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">{t('admin_field_fuel_type')}</label>
            <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_fuel_type')}</option>
              <option value="Petrol">{t('admin_fuel_petrol')}</option>
              <option value="Diesel">{t('admin_fuel_diesel')}</option>
              <option value="Electric">{t('admin_fuel_electric')}</option>
              <option value="Hybrid">{t('admin_fuel_hybrid')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">{t('admin_field_color')}</label>
            <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="doors" className="block text-sm font-medium text-gray-700">{t('admin_field_doors')}</label>
            <select id="doors" value={doors} onChange={(e) => setDoors(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">{t('admin_select_doors')}</option>
              {doorOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">{t('admin_field_short_description')}</label>
          <textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('admin_field_description')}</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700">{t('admin_field_terms')}</label>
          <textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{t('admin_policies_section_title')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('admin_policies_section_subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="extraKmCharge" className="block text-sm font-medium text-gray-700">{t('admin_field_extra_km_charge')}</label>
              <input type="number" min="0" step="0.01" id="extraKmCharge" value={extraKmCharge} onChange={(e) => setExtraKmCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="fuelMissingCharge" className="block text-sm font-medium text-gray-700">{t('admin_field_fuel_missing_charge')}</label>
              <input type="number" min="0" step="0.01" id="fuelMissingCharge" value={fuelMissingCharge} onChange={(e) => setFuelMissingCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="scratchCharge" className="block text-sm font-medium text-gray-700">{t('admin_field_scratch_charge')}</label>
              <input type="number" min="0" step="0.01" id="scratchCharge" value={scratchCharge} onChange={(e) => setScratchCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="damagePolicy" className="block text-sm font-medium text-gray-700">{t('admin_field_damage_policy')}</label>
              <textarea id="damagePolicy" value={damagePolicy} onChange={(e) => setDamagePolicy(e.target.value)} rows={3} placeholder={t('admin_placeholder_damage_policy')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <div>
              <label htmlFor="accidentProcedure" className="block text-sm font-medium text-gray-700">{t('admin_field_accident_procedure')}</label>
              <textarea id="accidentProcedure" value={accidentProcedure} onChange={(e) => setAccidentProcedure(e.target.value)} rows={3} placeholder={t('admin_placeholder_accident_procedure')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <div>
              <label htmlFor="glassCoverPolicy" className="block text-sm font-medium text-gray-700">{t('admin_field_glass_cover')}</label>
              <textarea id="glassCoverPolicy" value={glassCoverPolicy} onChange={(e) => setGlassCoverPolicy(e.target.value)} rows={3} placeholder={t('admin_placeholder_glass_cover')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('admin_field_features')}</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Air Conditioning', 'GPS Navigation', 'Automatic Transmission', 'Bluetooth Connectivity', 'Apple CarPlay', 'Android Auto', 'Rearview Camera', 'Lane Assist', 'Autopilot', 'Glass Roof', 'Heated Seats', 'Sunroof', 'Parking Sensors', 'Keyless Entry', 'Adaptive Cruise Control', 'Blind Spot Monitoring', 'Leather Seats', 'Panoramic Roof', 'Heated Steering Wheel', 'Ventilated Seats', 'Wireless Charging', 'Heads-Up Display', '360 Camera', 'All-Wheel Drive', 'Sport Package', 'Premium Sound System'].map(feature => (
              <div key={feature} className="flex items-center">
                <input id={feature} type="checkbox" value={feature} onChange={handleFeatureChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor={feature} className="ml-2 block text-sm text-gray-900">{feature}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">{t('admin_field_main_image')}</label>
          <input id="mainImage" type="file" onChange={handleMainImageChange} required className="mt-1 block w-full" />
          {mainImagePreview && (
            <div className="mt-2 relative w-32 h-32">
              <Image src={mainImagePreview} alt="Main Image Preview" layout="fill" objectFit="cover" className="rounded-md" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="otherImages" className="block text-sm font-medium text-gray-700">{t('admin_field_other_images')}</label>
          <input id="otherImages" type="file" multiple onChange={handleOtherImagesChange} className="mt-1 block w-full" />
          <div className="mt-2 flex flex-wrap gap-2">
            {otherImagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image src={preview} alt={`Other Image ${index + 1} Preview`} layout="fill" objectFit="cover" className="rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveOtherImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? t('admin_adding_car') : t('admin_add_car_submit')}
        </button>
      </form>
    </>
  );
}

export default withAdminAuth(NewCarPage);