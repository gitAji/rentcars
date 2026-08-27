'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Image from 'next/image';
import { FaTrash, FaExclamationTriangle, FaCalendarTimes } from 'react-icons/fa';
import { getErrorMessage } from '@/lib/errorMessage';

interface BlockedDate {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
}

function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;

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

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedDatesError, setBlockedDatesError] = useState<string | null>(null);
  const [newBlockStart, setNewBlockStart] = useState('');
  const [newBlockEnd, setNewBlockEnd] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [addingBlock, setAddingBlock] = useState(false);

  const norwegianTowns = ["Oslo", "Bergen", "Stavanger", "Trondheim", "Tromsø", "Kristiansand", "Fredrikstad", "Sandnes", "Drammen", "Porsgrunn"];
  const passengerOptions = [2, 4, 5, 7];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);
  const doorOptions = [2, 3, 4, 5];
  const transmissionOptions = ["Automatic", "Manual"];
  const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];

  useEffect(() => {
    const fetchCar = async () => {
      const { data: car, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (error) {
        setError(error.message);
      } else if (car) {
        setMake(car.make);
        setModel(car.model);
        setYear(car.year);
        setPrice(car.price);
        setTown(car.town);
        setPassengers(car.passengers);
        setCarType(car.car_type);
        setSeats(car.seats);
        setShortDescription(car.short_description);
        setDescription(car.description);
        setTerms(car.terms);
        setFeatures(car.features || []);
        setTransmission(car.transmission || '');
        setFuelType(car.fuel_type || '');
        setColor(car.color || '');
        setDoors(car.doors || '');
        setExtraKmCharge(car.extra_km_charge ?? '');
        setFuelMissingCharge(car.fuel_missing_charge ?? '');
        setScratchCharge(car.scratch_charge ?? '');
        setDamagePolicy(car.damage_policy || '');
        setAccidentProcedure(car.accident_procedure || '');
        setGlassCoverPolicy(car.glass_cover_policy || '');

        // Set image previews for existing images
        if (car.image_url) {
          setMainImagePreview(car.image_url);
        }
        if (car.image_urls && car.image_urls.length > 0) {
          setOtherImagePreviews(car.image_urls);
        }
      }
      setLoadingData(false);
    };

    fetchCar();
  }, [carId]);

  const fetchBlockedDates = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('car_unavailability')
      .select('id, start_date, end_date, reason')
      .eq('car_id', carId)
      .order('start_date', { ascending: true });

    if (fetchError) {
      // The car_unavailability table may not exist yet -- this feature needs a
      // one-time SQL migration (see supabase/car_unavailability.sql).
      setBlockedDatesError(fetchError.message);
    } else {
      setBlockedDatesError(null);
      setBlockedDates(data || []);
    }
  }, [carId]);

  useEffect(() => {
    fetchBlockedDates();
  }, [fetchBlockedDates]);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockStart || !newBlockEnd) return;
    if (newBlockEnd < newBlockStart) {
      setBlockedDatesError('End date must be on or after the start date.');
      return;
    }

    setAddingBlock(true);
    setBlockedDatesError(null);
    const { error: insertError } = await supabase.from('car_unavailability').insert({
      car_id: carId,
      start_date: newBlockStart,
      end_date: newBlockEnd,
      reason: newBlockReason || null,
    });

    if (insertError) {
      setBlockedDatesError(insertError.message);
    } else {
      setNewBlockStart('');
      setNewBlockEnd('');
      setNewBlockReason('');
      await fetchBlockedDates();
    }
    setAddingBlock(false);
  };

  const handleDeleteBlock = async (blockId: number) => {
    const { error: deleteError } = await supabase.from('car_unavailability').delete().eq('id', blockId);
    if (deleteError) {
      setBlockedDatesError(deleteError.message);
    } else {
      setBlockedDates((prev) => prev.filter((b) => b.id !== blockId));
    }
  };

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
    setLoadingSubmit(true);
    setError(null);

    try {
      let finalMainImageUrl = mainImagePreview; // Start with current preview
      let finalOtherImageUrls = [...otherImagePreviews]; // Start with current previews

      // 1. Handle main image upload if changed
      if (mainImage) {
        const mainImageFileName = `${Date.now()}-${mainImage.name}`;
        const { data: mainImageData, error: mainImageError } = await supabase.storage
          .from('car_images')
          .upload(mainImageFileName, mainImage);
        if (mainImageError) throw mainImageError;
        const { data: { publicUrl } } = supabase.storage.from('car_images').getPublicUrl(mainImageData.path);
        finalMainImageUrl = publicUrl;
      }

      // 2. Handle other images: upload new ones and keep existing ones
      const newOtherImagesToUpload = otherImages.filter(file => file instanceof File); // Filter out existing URLs (which are strings)
      const existingOtherImageUrls = otherImagePreviews.filter(preview => typeof preview === 'string'); // Keep existing URLs

      const uploadedOtherImageUrls: string[] = [];
      if (newOtherImagesToUpload.length > 0) {
        const uploadPromises = newOtherImagesToUpload.map(file => {
          const fileName = `${Date.now()}-${file.name}`;
          return supabase.storage.from('car_images').upload(fileName, file);
        });
        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach(result => {
          if (result.error) throw result.error;
          const { data: { publicUrl } } = supabase.storage.from('car_images').getPublicUrl(result.data.path);
          uploadedOtherImageUrls.push(publicUrl);
        });
      }
      finalOtherImageUrls = [...existingOtherImageUrls, ...uploadedOtherImageUrls];

      // 3. Update car data in the database
      const { error: updateError } = await supabase.from('cars').update({
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
        image_url: finalMainImageUrl,
        image_urls: finalOtherImageUrls,
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
      }).eq('id', carId);

      if (updateError) throw updateError;

      alert('Car updated successfully!');
      router.push('/admin/cars'); // Redirect to manage cars page

    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Car</h1>
      {error && <p className="text-red-500 py-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
            <input type="text" id="make" value={make} onChange={(e) => setMake(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
            <select id="year" value={year} onChange={(e) => setYear(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Year</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per day)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700">Town/Location</label>
            <select id="town" value={town} onChange={(e) => setTown(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Town</option>
              {norwegianTowns.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Passengers</label>
            <select id="passengers" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Passengers</option>
              {passengerOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="carType" className="block text-sm font-medium text-gray-700">Car Type</label>
            <select id="carType" value={carType} onChange={(e) => setCarType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Car Type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Electric">Electric</option>
              <option value="Van">Van</option>
              <option value="Compact">Compact</option>
            </select>
          </div>
          <div>
            <label htmlFor="seats" className="block text-sm font-medium text-gray-700">Seats</label>
            <select id="seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Seats</option>
              {passengerOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
            <select id="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Transmission</option>
              {transmissionOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">Fuel Type</label>
            <select id="fuelType" value={fuelType} onChange={(e) => setFuelType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Fuel Type</option>
              {fuelTypeOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="doors" className="block text-sm font-medium text-gray-700">Doors</label>
            <select id="doors" value={doors} onChange={(e) => setDoors(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option value="">Select Doors</option>
              {doorOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Full Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700">Terms</label>
          <textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Rental Policies &amp; Extra Charges</h2>
          <p className="text-sm text-gray-500 mb-4">Shown to customers on the car&apos;s details page. Leave blank to hide a field.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="extraKmCharge" className="block text-sm font-medium text-gray-700">Extra Km Charge (kr/km)</label>
              <input type="number" min="0" step="0.01" id="extraKmCharge" value={extraKmCharge} onChange={(e) => setExtraKmCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="fuelMissingCharge" className="block text-sm font-medium text-gray-700">Fuel Missing Charge (kr)</label>
              <input type="number" min="0" step="0.01" id="fuelMissingCharge" value={fuelMissingCharge} onChange={(e) => setFuelMissingCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="scratchCharge" className="block text-sm font-medium text-gray-700">Scratch Charge (kr)</label>
              <input type="number" min="0" step="0.01" id="scratchCharge" value={scratchCharge} onChange={(e) => setScratchCharge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="damagePolicy" className="block text-sm font-medium text-gray-700">Damage Policy</label>
              <textarea id="damagePolicy" value={damagePolicy} onChange={(e) => setDamagePolicy(e.target.value)} rows={3} placeholder="How larger damage beyond scratches is assessed and charged." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <div>
              <label htmlFor="accidentProcedure" className="block text-sm font-medium text-gray-700">Accident Procedure</label>
              <textarea id="accidentProcedure" value={accidentProcedure} onChange={(e) => setAccidentProcedure(e.target.value)} rows={3} placeholder="What the renter must do if they're in an accident." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <div>
              <label htmlFor="glassCoverPolicy" className="block text-sm font-medium text-gray-700">Glass Cover</label>
              <textarea id="glassCoverPolicy" value={glassCoverPolicy} onChange={(e) => setGlassCoverPolicy(e.target.value)} rows={3} placeholder="What windshield/glass damage this car's cover includes." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Features</label>
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
          <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700">Main Image</label>
          <input id="mainImage" type="file" onChange={handleMainImageChange} className="mt-1 block w-full" />
          {mainImagePreview && (
            <div className="mt-2 relative w-32 h-32">
              <Image src={mainImagePreview} alt="Main Image Preview" layout="fill" objectFit="cover" className="rounded-md" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="otherImages" className="block text-sm font-medium text-gray-700">Other Images</label>
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
          disabled={loadingSubmit}
          className="btn-primary w-full"
        >
          {loadingSubmit ? 'Updating Car...' : 'Save Changes'}
        </button>
      </form>

      {/* Blocked Dates */}
      <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Blocked Dates</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manually block off dates this car isn&apos;t available for rent (maintenance, an off-platform
          booking, etc.). These dates are hidden from search and can&apos;t be selected at checkout,
          same as a real booking.
        </p>

        {blockedDatesError && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <FaExclamationTriangle className="shrink-0" />
            <span>{blockedDatesError}</span>
          </div>
        )}

        <form onSubmit={handleAddBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="blockStart" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="blockStart"
              value={newBlockStart}
              onChange={(e) => setNewBlockStart(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="blockEnd" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="blockEnd"
              value={newBlockEnd}
              min={newBlockStart || undefined}
              onChange={(e) => setNewBlockEnd(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="blockReason" className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <input
              type="text"
              id="blockReason"
              value={newBlockReason}
              onChange={(e) => setNewBlockReason(e.target.value)}
              placeholder="e.g. Service"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={addingBlock}
              className="w-full bg-accent text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {addingBlock ? 'Adding...' : 'Add Block'}
            </button>
          </div>
        </form>

        {blockedDates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
            <FaCalendarTimes size={24} />
            <p className="text-sm">No blocked dates for this car.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {blockedDates.map((block) => (
              <li key={block.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{block.start_date} — {block.end_date}</p>
                  {block.reason && <p className="text-sm text-gray-500">{block.reason}</p>}
                </div>
                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="flex items-center gap-1.5 text-red-500 hover:underline text-sm font-medium cursor-pointer"
                >
                  <FaTrash size={13} /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default withAdminAuth(EditCarPage);
