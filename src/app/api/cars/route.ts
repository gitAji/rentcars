import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const carsFilePath = path.join(process.cwd(), 'data', 'cars.json');

async function readCars() {
  const fileContents = await fs.readFile(carsFilePath, 'utf8');
  return JSON.parse(fileContents);
}

interface Car {
  id: number; // Assuming id is a number
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  town: string; // Added
  passengers: number; // Added
  carType: string; // Added
  description?: string;
  features?: string[];
  terms?: string;
}

async function writeCars(cars: Car[]) {
  await fs.writeFile(carsFilePath, JSON.stringify(cars, null, 2), 'utf8');
}

export async function GET(request: Request) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second delay
  const { searchParams } = new URL(request.url);
  const town = searchParams.get('town');
  const passengers = searchParams.get('passengers');
  const carType = searchParams.get('carType');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let cars: Car[] = await readCars(); // Typed cars

  // Basic filtering (availability not implemented for now)
  if (town) {
    cars = cars.filter((car: Car) => car.town && car.town.toLowerCase().includes(town.toLowerCase())); // Typed car
  }
  if (passengers) {
    cars = cars.filter((car: Car) => car.passengers && car.passengers >= parseInt(passengers)); // Typed car
  }
  if (carType) {
    cars = cars.filter((car: Car) => car.carType && car.carType.toLowerCase().includes(carType.toLowerCase())); // Typed car
  }

  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const newCar = await request.json();
  const cars: Car[] = await readCars(); // Typed cars
  const newId = cars.length > 0 ? Math.max(...cars.map((car: Car) => car.id)) + 1 : 1;
  const carWithId = { id: newId, ...newCar };
  cars.push(carWithId);
  await writeCars(cars);
  return NextResponse.json(carWithId, { status: 201 });
}
