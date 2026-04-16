import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const header = ['ID', 'Machine Code', 'Product', 'Version', 'Emitida', 'Expira', 'Revogada'].join(',');
  const rows = licenses.map(l => {
    return [
      l.id,
      l.machineCode,
      l.product,
      l.version,
      new Date(l.iat * 1000).toISOString(),
      new Date(l.exp * 1000).toISOString(),
      l.revoked ? 'Sim' : 'Não'
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="licenses.csv"'
    }
  });
}
