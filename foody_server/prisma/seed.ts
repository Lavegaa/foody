import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // admin 유저 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: '0',
      email: 'admin@example.com',
      name: 'Admin',
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
