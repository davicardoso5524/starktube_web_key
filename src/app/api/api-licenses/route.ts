import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey } from '@/lib/crypto';

export async function GET() {
  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(licenses);
}

export async function POST(request: Request) {
  try {
    const { machineCode, validityDays = 30 } = await request.json();

    if (!machineCode) {
      return NextResponse.json({ error: 'Machine code é obrigatório' }, { status: 400 });
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (validityDays * 24 * 60 * 60);

    const payload = {
      product: 'yt-download',
      version: 1,
      machineCode,
      iat,
      exp
    };

    const privateKeyB64 = process.env.LICENSE_PRIVATE_KEY_B64;
    if (!privateKeyB64) {
      throw new Error('LICENSE_PRIVATE_KEY_B64 não configurada no servidor');
    }

    const licenseKey = generateLicenseKey(payload, privateKeyB64);

    const license = await prisma.license.create({
      data: {
        machineCode,
        product: payload.product,
        version: payload.version,
        iat,
        exp,
        payloadJson: JSON.stringify(payload),
        signature: licenseKey.split('.')[2], // getting signature from generated key
        licenseKey
      }
    });

    return NextResponse.json(license);
  } catch (error: any) {
    console.error('Erro ao gerar licença:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
