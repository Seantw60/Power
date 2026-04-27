import { config } from "dotenv"
config({ path: ".env.local" })

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12)

  const user = await prisma.user.upsert({
    where: { email: "rob@launchpadphilly.org" },
    update: {},
    create: {
      email: "rob@launchpadphilly.org",
      password: hashedPassword,
      name: "Rob",
      role: "gym_owner",
    },
  })

  await prisma.member.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      name: "Sarah L",
      gymOwnerId: user.id,
    },
  })

  await prisma.member.upsert({
    where: { email: "mike@example.com" },
    update: {},
    create: {
      email: "mike@example.com",
      name: "Mike T",
      gymOwnerId: user.id,
    },
  })

  await prisma.member.upsert({
    where: { email: "adam@example.com" },
    update: {},
    create: {
      email: "adam@example.com",
      name: "Adam K",
      gymOwnerId: user.id,
    },
  })

  console.log("Seed complete — user and members created")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
