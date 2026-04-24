"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ProfileScreen() {
  const router = useRouter()
  const [status, setStatus] = useState("Ready")

  return (
    <AppShell
      title="Profile"
      subtitle="Coach account details and gym configuration"
      actions={
        <>
          <MotionButton onClick={() => setStatus("Profile saved")}>Save Profile</MotionButton>
          <MotionButton
            variant="ghost"
            onClick={() => {
              setStatus("Changes canceled")
              router.push("/dashboard")
            }}
          >
            Cancel
          </MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status}</p>
      </FadeCard>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Coach Information</h2>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
            <label className="block">
              <span className="mb-1 block">Name</span>
              <input className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="Rob Coach" />
            </label>
            <label className="block">
              <span className="mb-1 block">Email</span>
              <input className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="rob@launchpadphilly.org" />
            </label>
            <label className="block">
              <span className="mb-1 block">Phone</span>
              <input className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="(267) 555-0147" />
            </label>
            <label className="block">
              <span className="mb-1 block">Gym Name</span>
              <input className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="Power Gym" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block">Bio</span>
              <textarea
                rows={3}
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                defaultValue="Strength and conditioning coach focused on long-term athletic development."
              />
            </label>
          </div>
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Account</h2>
          <ul className="mt-3 space-y-2 text-base leading-tight sm:text-2xl">
            <li>Role: Owner Coach</li>
            <li>Plan: Pro</li>
            <li>Members: 47 active</li>
            <li>Created: Jan 2026</li>
          </ul>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-xl leading-none sm:text-2xl">Preferences</h2>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 block">Default Metric</span>
            <select className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]">
              <option>Volume</option>
              <option>Attendance</option>
              <option>Intensity</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block">Timezone</span>
            <select className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]">
              <option>America/New_York</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block">Weekly Goal</span>
            <input className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="3 sessions/member" />
          </label>
        </div>
      </FadeCard>
    </AppShell>
  )
}
