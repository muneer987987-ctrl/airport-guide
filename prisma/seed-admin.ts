/**
 * Usage: tsx prisma/seed-admin.ts you@example.com "a-strong-password"
 * Creates (or resets the password of) an admin user for /admin login.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage: tsx prisma/seed-admin.ts you@example.com "a-strong-password"');
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
