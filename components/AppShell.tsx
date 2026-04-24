"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { PropsWithChildren, ReactNode } from "react"

type AppShellProps = PropsWithChildren<{
  title: string
  subtitle: string
  actions?: ReactNode
}>

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/analytics", label: "Analytics" },
  { href: "/ai", label: "Insights" },
  { href: "/profile", label: "Profile" },
]

export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f9ff,_#dbeafe_45%,_#ecfeff_100%)] p-2 pb-20 text-[#10233f] sm:p-6 sm:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl"
      >
        <header className="border-2 border-[#1d4f91] bg-[#f8fcff] px-3 py-2 shadow-[3px_3px_0_#14447d]">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
              <p className="text-2xl leading-none tracking-tight text-[#0f3f75] sm:text-3xl">POWER</p>
              <div className="hidden h-4 w-px bg-[#bfd6ef] sm:block" />
              <nav className="hidden items-center text-sm sm:flex">
                {navItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={`top-${item.href}`}
                      href={item.href}
                      className={`border-r border-[#bfd6ef] px-2 py-0.5 leading-tight transition last:border-r-0 ${
                        isActive ? "bg-[#dbeafe] text-[#0f3f75]" : "bg-transparent text-[#1c4e83] hover:bg-[#ecf5ff]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="border border-[#1d4f91] bg-[#e0efff] px-3 py-1 text-xs text-[#0f3f75] transition hover:bg-[#cfe6ff]"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mt-3 border-2 border-[#1d4f91] bg-[#0f3f75] p-4 text-[#f3fbff] shadow-[3px_3px_0_#14447d] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2f5f96] pb-3">
            <div>
              <h1 className="text-2xl leading-none tracking-tight sm:text-5xl">{title}</h1>
              <p className="mt-1 text-[10px] text-[#d5e8fb] sm:text-xs">{subtitle}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.07, delayChildren: 0.1 },
              },
            }}
            className="mt-3"
          >
            {children}
          </motion.div>
        </section>
      </motion.div>

      <nav className="fixed inset-x-2 bottom-2 z-20 border-2 border-[#1d4f91] bg-[#f8fcff] p-1 shadow-[3px_3px_0_#14447d] sm:hidden">
        <div className="grid grid-cols-5 text-center text-[11px] leading-none text-[#1c4e83]">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={`border-r border-[#bfd6ef] px-1 py-1.5 last:border-r-0 ${isActive ? "bg-[#dbeafe] text-[#0f3f75]" : ""}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export function FadeCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
      }}
      className={`border-2 border-[#1d4f91] bg-[#f8fcff] p-3 text-[#10233f] shadow-[3px_3px_0_#14447d] ${className ?? ""}`}
    >
      {children}
    </motion.div>
  )
}
