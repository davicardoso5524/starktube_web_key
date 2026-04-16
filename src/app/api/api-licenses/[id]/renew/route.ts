import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey } from '@/lib/crypto';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { validityDays } = await request.json();

    if (!validityDays) {
      return NextResponse.json({ error: 'Faltam os dias de validade' }, { status: 400 });
    }

    const oldLicense = await prisma.license.findUnique({
      where: { id: params.id }
    });

    if (!oldLicense) {
      return NextResponse.json({ error: 'Licença não encontrada' }, { status: 404 });
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (validityDays * 24 * 60 * 60);

    const payload = {
      product: oldLicense.product,
      version: oldLicense.version,
      machineCode: oldLicense.machineCode,
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
        machineCode: payload.machineCode,
        product: payload.product,
        version: payload.version,
        iat,
        exp,
        payloadJson: JSON.stringify(payload),
        signature: licenseKey.split('.')[2],
        licenseKey
      }
    });

    return NextResponse.json(license);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
