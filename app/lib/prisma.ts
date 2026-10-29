import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 1. Create the PostgreSQL adapter using your .env connection string
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// 2. Pass the adapter into PrismaClient
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // <-- This is the required fix for Prisma 7
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma