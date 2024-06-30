import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const categories = Array.from({ length: 100 }, () => ({
    name: faker.commerce.department(),
  }));

  await prisma.category.createMany({
    data: categories,
  });

  console.log('Categories created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });