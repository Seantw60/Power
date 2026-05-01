import { ProfileScreen } from "@/components/screens/ProfileScreen"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Profile | Power Gym App",
}

export default async function ProfilePage() {
  await requireUser("/profile")

  return <ProfileScreen />
}
