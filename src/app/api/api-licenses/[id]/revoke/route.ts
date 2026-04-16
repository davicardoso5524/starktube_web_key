import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const license = await prisma.license.update({
      where: { id: params.id },
      data: { revoked: true }
    });

    return NextResponse.json(license);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
