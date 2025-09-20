import { NextResponse } from 'next/server';
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
    const cars: Car[] = JSON.parse(file);
    cachedCars = cars;
    return cars;
  } catch (error) {
    console.error('Error reading cars file:', error);
    throw new Error('Failed to load cars data');
  }
}

// GET handler for all cars
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const town = searchParams.get('town');
    const carType = searchParams.get('carType');

    const cars = await readCars();

    let filteredCars = cars;

    if (town) {
      filteredCars = filteredCars.filter(car => car.town.toLowerCase() === town.toLowerCase());
    }

    if (carType) {
      filteredCars = filteredCars.filter(car => car.carType.toLowerCase() === carType.toLowerCase());
    }

    return NextResponse.json(filteredCars);
  } catch (error) {
    console.error('Error in GET /api/cars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
