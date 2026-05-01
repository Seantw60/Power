import { AnalyticsScreen } from "@/components/screens/AnalyticsScreen"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Analytics | Power Gym App",
}

export default async function AnalyticsPage() {
  await requireUser("/analytics")

  return <AnalyticsScreen />
}
