import { NextResponse } from 'next/server';
import { verifyLicense } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { licenseKey } = await request.json();

    if (!licenseKey) {
      return NextResponse.json({ error: 'Chave não fornecida' }, { status: 400 });
    }

    const publicKeyB64 = process.env.LICENSE_PUBLIC_KEY_B64;
    if (!publicKeyB64) {
      throw new Error('LICENSE_PUBLIC_KEY_B64 não configurada');
    }

    const isValid = verifyLicense(licenseKey, publicKeyB64);

    return NextResponse.json({ valid: isValid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
