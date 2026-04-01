import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const [db, user, version] = await Promise.all([
    prisma.$queryRaw`SELECT current_database() as db`,
    prisma.$queryRaw`SELECT current_user as user`,
    prisma.$queryRaw`SELECT version() as version`,
  ]);

  const restrictionsCount = await prisma.$queryRaw`
    SELECT count(*)::int as count FROM "Restrictions"
  `;

  console.log({
    current_database: db[0].db,
    current_user: user[0].user,
    restrictions_count: restrictionsCount[0].count,
    version: version[0].version,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
