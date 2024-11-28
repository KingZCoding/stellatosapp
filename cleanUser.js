import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Clearing all users and associated data...');

    // Clear related data first (to handle foreign key constraints)
    await prisma.cart.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});

    // Clear users
    await prisma.user.deleteMany({});

    console.log('All users and related data have been cleared!');
  } catch (error) {
    console.error('Error clearing the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
