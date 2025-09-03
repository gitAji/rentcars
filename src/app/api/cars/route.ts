import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the Car interface
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  town: string;
  passengers: number;
  carType: string;
  description?: string;
  features?: string[];
  terms?: string;
}

// Path to the JSON file
const carsFilePath = path.join(process.cwd(), 'data', 'cars.json');

// Cache for cars data to avoid repeated file reads
let cachedCars: Car[] | null = null;

// Read cars from file
async function readCars(): Promise<Car[]> {
  if (cachedCars) {
    return cachedCars;
  }
  try {
    const file = await fs.readFile(carsFilePath, 'utf-8');
    cachedCars = JSON.parse(file);
    return cachedCars;
  } catch (error) {
    console.error('Error reading cars file:', error);
    throw new Error('Failed to load cars data');
  }
}

// GET handler with corrected type
export async function GET(
  req: NextRequest,
  { params }: { params: Record<string, string> } // Flexible type to avoid type error
) {
  try {
    const carId = parseInt(params.id);

    // Validate ID
    if (isNaN(carId) || carId <= 0) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }

    const cars = await readCars();
    const car = cars.find((car) => car.id === carId);

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error(`Error in GET /api/cars/[id] for id ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}