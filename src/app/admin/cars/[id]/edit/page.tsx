'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import withAdminAuth from '@/components/withAdminAuth';
import Loading from '@/components/loading';
import Image from 'next/image';

function EditCarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const carId = params.id;

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

  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      let uploadedOtherImageUrls: string[] = [];
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
      }).eq('id', carId);

      if (updateError) throw updateError;

      alert('Car updated successfully!');
      router.push('/admin/cars'); // Redirect to manage cars page

    } catch (error: any) {
      setError(error.message);
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
          className="w-full px-4 py-3 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 cursor-pointer"
        >
          {loadingSubmit ? 'Updating Car...' : 'Save Changes'}
        </button>
      </form>
    </>
  );
}

export default withAdminAuth(EditCarPage);
