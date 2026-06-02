import { ProfileScreen } from "@/components/screens/ProfileScreen"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Profile | Power Gym App",
}

export default async function ProfilePage() {
  const user = await requireUser("/profile")

  const memberCount = await prisma.member.count({ where: { ownerId: user.id } })

  return (
    <ProfileScreen
      name={user.name ?? ""}
      email={user.email}
      memberCount={memberCount}
      createdAt={user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
    />
  )
}
