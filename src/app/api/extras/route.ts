import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const extrasFilePath = path.join(process.cwd(), 'data', 'extras.json');

async function readExtras() {
  const fileContents = await fs.readFile(extrasFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function GET() {
  const extras = await readExtras();
  return NextResponse.json(extras);
}
