import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const carsFilePath = path.join(process.cwd(), 'data', 'cars.json');

interface Car {
  id: number; // Assuming id is a number
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  description?: string;
  features?: string[];
  terms?: string;
}

async function readCars() {
  const fileContents = await fs.readFile(carsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second delay
  const { id } = await params; // Access id from awaited params
  const cars = await readCars();
  const car = cars.find((c: Car) => c.id === parseInt(id)); // Typed c

  if (car) {
    return NextResponse.json(car);
  } else {
    return new NextResponse('Car not found', { status: 404 });
  }
}