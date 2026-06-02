import { LoginScreen } from "@/components/screens/LoginScreen"
import { Suspense } from "react"

export const metadata = {
  title: "Login | Power Gym App",
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginScreen />
    </Suspense>
  )
}
