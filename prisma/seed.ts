import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаем пользователей
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
    },
  });

  // Создаем посты
  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'First Post',
      content: 'This is the first post content',
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Draft Post',
      content: 'This is a draft post',
      published: false,
      authorId: user2.id,
    },
  });

  console.log('Seed data created:', { user1, user2, post1, post2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
