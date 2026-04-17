import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Helper to validate if a string is a valid URL and not "undefined"/"null"
function getValidUrl(urls: (string | undefined)[]): string {
  for (const url of urls) {
    if (url && url !== 'undefined' && url !== 'null' && url.trim() !== '') {
      return url;
    }
  }
  return 'file:./dev.db'; // Ultimate fallback
}

const dbUrl = getValidUrl([
  process.env.TURSO_DATABASE_URL,
  process.env.DATABASE_URL
]);

let dbAuthToken = process.env.TURSO_AUTH_TOKEN;
if (!dbAuthToken || dbAuthToken === 'undefined' || dbAuthToken === 'null') {
  dbAuthToken = undefined;
}

// Diagnostic Log (visible in Vercel logs)
if (process.env.NODE_ENV === 'production') {
  console.log(`[Database] Connecting with protocol: ${dbUrl.split(':')[0]}`);
}

const libsql = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

const adapter = new PrismaLibSql(libsql);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
