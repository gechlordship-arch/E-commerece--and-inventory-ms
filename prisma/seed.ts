import "dotenv/config"; // Loads DATABASE_URL from .env
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Create the adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// 2. Pass the adapter to PrismaClient
const prisma = new PrismaClient({ adapter })

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: 'my-store' },
    update: {},
    create: { name: 'My Store', slug: 'my-store' },
  })

  await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: 'classic-tee' } },
    update: {},
    create: {
      storeId: store.id,
      title: 'Classic Tee',
      slug: 'classic-tee',
      status: 'active',
      variants: {
        create: [
          { sku: 'TEE-S-BLK', title: 'Small / Black', priceCents: 1999 },
          { sku: 'TEE-M-BLK', title: 'Medium / Black', priceCents: 1999 },
        ],
      },
    },
  })

  console.log('Seeded database with store:', store.name)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })