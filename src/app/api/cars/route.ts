import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest } from 'next';
import type { NextPageContext } from 'next';

import fs from 'fs/promises';
import path from 'path';

const carsFilePath = path.join(process.cwd(), 'data', 'cars.json');

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

async function readCars(): Promise<Car[]> {
  const fileContents = await fs.readFile(carsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

// ✅ Correct signature (no destructuring directly)
export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  const { id } = context.params;

  const carId = parseInt(id);
  if (isNaN(carId)) {
    return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
  }

  const cars = await readCars();
  const car = cars.find((car) => car.id === carId);

  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }

  return NextResponse.json(car);
}
