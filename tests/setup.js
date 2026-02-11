const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up test database before running tests
  await prisma.todo.deleteMany({});
});

afterEach(async () => {
  // Clean up after each test
  await prisma.todo.deleteMany({});
});

afterAll(async () => {
  // Disconnect Prisma after all tests
  await prisma.$disconnect();
});
