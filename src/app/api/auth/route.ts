import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === 'admin@stark.com' && password === 'adminstark') {
    cookies().set('ytdl_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Credenciais incorretas' }, { status: 401 });
}

export async function DELETE() {
  cookies().delete('ytdl_admin_session');
  return NextResponse.json({ success: true });
}
