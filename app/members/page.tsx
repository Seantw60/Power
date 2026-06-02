import { MembersScreen } from "@/components/screens/MembersScreen"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Members | Power Gym App",
}

export default async function MembersPage() {
  const user = await requireUser("/members")

  const members = await prisma.member.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true, email: true, age: true, goal: true },
    orderBy: { name: "asc" },
  })

  return <MembersScreen members={members} />
}
