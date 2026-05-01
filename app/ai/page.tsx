import { AIScreen } from "@/components/screens/AIScreen"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "AI | Power Gym App",
}

export default async function AIPage() {
  await requireUser("/ai")

  return <AIScreen />
}
