import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Simple hardcoded credentials for prototype
  if (username === 'admin' && password === 'password') {
    return NextResponse.json({ message: 'Login successful' });
  } else {
    return new NextResponse('Invalid credentials', { status: 401 });
  }
}
