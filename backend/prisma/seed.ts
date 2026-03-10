/**
 * prisma/seed.ts
 * Seeds the database with 10 sample students for development/testing.
 * Run: npx ts-node prisma/seed.ts
 * Or add to package.json prisma.seed and run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedStudents = [
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 21 },
  { name: 'Bob Martinez', email: 'bob.martinez@example.com', age: 23 },
  { name: 'Carol Williams', email: 'carol.williams@example.com', age: 20 },
  { name: 'David Brown', email: 'david.brown@example.com', age: 25 },
  { name: 'Eva Garcia', email: 'eva.garcia@example.com', age: 22 },
  { name: 'Frank Lee', email: 'frank.lee@example.com', age: 24 },
  { name: 'Grace Kim', email: 'grace.kim@example.com', age: 19 },
  { name: 'Henry Chen', email: 'henry.chen@example.com', age: 26 },
  { name: 'Isla Patel', email: 'isla.patel@example.com', age: 21 },
  { name: 'James Wilson', email: 'james.wilson@example.com', age: 23 },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const student of seedStudents) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: student,
    });
    console.log(`  ✓ ${student.name}`);
  }

  const total = await prisma.student.count();
  console.log(`\n✅ Database seeded — ${total} students total`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
