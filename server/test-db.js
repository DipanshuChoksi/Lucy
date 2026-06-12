const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'web-user@example.com' },
    include: { settings: true, githubIntegration: true, s3Integration: true }
  });
  console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
