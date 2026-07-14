import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const firstUser = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (!firstUser) {
    console.log("No users found in database.");
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: firstUser.id },
    data: { role: "SUPERADMIN" }
  });

  console.log(`Successfully upgraded user ${updatedUser.email} to SUPERADMIN.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
