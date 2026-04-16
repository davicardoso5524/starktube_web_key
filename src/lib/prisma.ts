import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let dbUrl = process.env.TURSO_DATABASE_URL;
if (!dbUrl || dbUrl === 'undefined' || dbUrl === 'null' || dbUrl.trim() === '') {
  dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
}

let dbAuthToken = process.env.TURSO_AUTH_TOKEN;
if (dbAuthToken === 'undefined' || dbAuthToken === 'null') {
  dbAuthToken = undefined;
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
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
