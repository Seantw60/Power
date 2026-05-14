import { AIScreen } from "@/components/screens/AIScreen"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "AI | Power Gym App",
}

export default async function AIPage() {
  const user = await requireUser("/ai")

  const members = await prisma.member.findMany({
    where: { ownerId: user.id },
    select: {
      id: true,
      name: true,
      goal: true,
    },
    orderBy: { name: "asc" },
  })

  return <AIScreen members={members} />
}
