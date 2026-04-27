import { prisma } from "@/lib/prisma"
import { WorkoutsScreen } from "@/components/screens/WorkoutsScreen"

export const metadata = {
  title: "Workouts | Power Gym App",
}

export default async function WorkoutsPage() {
  const user = await prisma.user.findUnique({
    where: { email: "rob@launchpadphilly.org" },
    select: { id: true },
  })

  if (!user) {
    return <WorkoutsScreen members={[]} workouts={[]} />
  }

  const [members, workouts] = await Promise.all([
    prisma.member.findMany({
      where: { gymOwnerId: user.id },
      orderBy: { name: "asc" },
    }),
    prisma.workout.findMany({
      where: { userId: user.id },
      include: { member: true, items: true },
      orderBy: { date: "desc" },
    }),
  ])

  return <WorkoutsScreen members={members} workouts={workouts} />
}
