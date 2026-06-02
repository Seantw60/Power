import { DashboardScreen } from "@/components/screens/DashboardScreen"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Dashboard | Power Gym App",
}

export default async function DashboardPage() {
  const user = await requireUser("/dashboard")

  const startOfWeek = new Date()
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const [memberCount, weeklyWorkouts, recentWorkouts] = await Promise.all([
    prisma.member.count({ where: { ownerId: user.id } }),
    prisma.workout.count({ where: { userId: user.id, date: { gte: startOfWeek } } }),
    prisma.workout.findMany({
      where: { userId: user.id },
      include: { member: { select: { name: true } } },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ])

  const feed = recentWorkouts.map((w) => ({
    id: w.id,
    memberName: w.member.name,
    date: w.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return <DashboardScreen memberCount={memberCount} weeklyWorkouts={weeklyWorkouts} recentWorkouts={feed} />
}
