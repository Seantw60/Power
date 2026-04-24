"use client"

import { MotionButton } from "@/components/ui/MotionButton"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DEMO_EMAIL = "rob@launchpadphilly.org"
const DEMO_PASSWORD = "password123"

export function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setError("")
      router.push("/dashboard")
      return
    }

    setError("Invalid credentials")
  }

  return (
    <div className="min-h-screen bg-[#d7d7d7] p-2 text-[#111111] sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl"
      >
        <section className="border-2 border-[#2f2f33] bg-[#d0d0d0] shadow-[3px_3px_0_#2b2b2f]">
          <div className="border-b-2 border-[#2f2f33] px-3 py-2 text-2xl leading-none sm:text-4xl">POWER</div>

          <div className="bg-[#3f3f43] p-3 sm:p-6 md:p-8">
            <div className="mx-auto max-w-xl border-2 border-[#2f2f33] bg-[#d0d0d0] p-4 shadow-[3px_3px_0_#2b2b2f]">
              <h2 className="text-3xl leading-none sm:text-5xl">USER LOGIN</h2>
              <div className="mt-2 border-t border-[#8a8a8a]" />

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="space-y-3 text-xs sm:text-sm">
                  <label className="block">
                    <span className="mb-1 block">Email</span>
                    <input
                      className="w-full border border-[#8a8a8a] bg-[#d8d8d8] px-2 py-1"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block">Password</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-[#8a8a8a] bg-[#d8d8d8] px-2 py-1"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <span className="inline-block h-4 w-4 border border-[#8a8a8a] bg-[#d8d8d8]" />
                    {showPassword ? "Hide password" : "Show Password"}
                  </button>

                  <div className="pt-2">
                    <MotionButton type="submit" className="min-w-28">Sign In</MotionButton>
                  </div>

                  <div className="border border-[#8a8a8a] bg-[#d8d8d8] p-2 text-center text-sm">
                    <p>Demo: {DEMO_EMAIL}</p>
                    <p>{DEMO_PASSWORD}</p>
                  </div>

                  {error ? <p className="text-sm text-[#7d0f0f]">Error State: {error}.</p> : null}
                </div>
              </form>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
