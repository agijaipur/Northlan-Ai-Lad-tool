import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // In a real app, use environment variables and hashing.
    // For this MVP, we use a simple hardcoded password.
    if (password === 'admin123') {
      const response = NextResponse.json({ success: true });
      
      // Set secure cookie
      response.cookies.set({
        name: 'admin_session',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
