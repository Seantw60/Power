import { AnalyticsScreen } from "@/components/screens/AnalyticsScreen"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Analytics | Power Gym App",
}

export default async function AnalyticsPage() {
  const user = await requireUser("/analytics")

  const now = new Date()

  // Build last-4-months buckets (oldest first)
  const months: { label: string; start: Date; end: Date }[] = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (3 - i), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    return {
      label: d.toLocaleString("en-US", { month: "short" }),
      start: d,
      end,
    }
  })

  const [allWorkouts, members] = await Promise.all([
    prisma.workout.findMany({
      where: {
        userId: user.id,
        date: { gte: months[0].start },
      },
      select: { date: true, memberId: true },
    }),
    prisma.member.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  const monthlyWorkouts = months.map((bucket) => ({
    label: bucket.label,
    count: allWorkouts.filter((w) => w.date >= bucket.start && w.date < bucket.end).length,
  }))

  const memberFrequency = members.map((member) => ({
    name: member.name,
    count: allWorkouts.filter((w) => w.memberId === member.id).length,
  })).sort((a, b) => b.count - a.count)

  const totalWorkouts = allWorkouts.length
  const topMember = memberFrequency[0] ?? null

  return (
    <AnalyticsScreen
      monthlyWorkouts={monthlyWorkouts}
      memberFrequency={memberFrequency}
      totalWorkouts={totalWorkouts}
      topMember={topMember}
    />
  )
}
