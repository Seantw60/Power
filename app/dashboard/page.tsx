import { DashboardScreen } from "@/components/screens/DashboardScreen"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Dashboard | Power Gym App",
}

export default async function DashboardPage() {
  await requireUser("/dashboard")

  return <DashboardScreen />
}
