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
    update: {
      age: 29,
      goal: "Build lower-body strength",
      ownerId: user.id,
    },
    create: {
      email: "sarah@example.com",
      name: "Sarah L",
      age: 29,
      goal: "Build lower-body strength",
      ownerId: user.id,
    },
  })

  await prisma.member.upsert({
    where: { email: "mike@example.com" },
    update: {
      age: 34,
      goal: "Increase conditioning",
      ownerId: user.id,
    },
    create: {
      email: "mike@example.com",
      name: "Mike T",
      age: 34,
      goal: "Increase conditioning",
      ownerId: user.id,
    },
  })

  await prisma.member.upsert({
    where: { email: "adam@example.com" },
    update: {
      age: 41,
      goal: "Improve consistency",
      ownerId: user.id,
    },
    create: {
      email: "adam@example.com",
      name: "Adam K",
      age: 41,
      goal: "Improve consistency",
      ownerId: user.id,
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
