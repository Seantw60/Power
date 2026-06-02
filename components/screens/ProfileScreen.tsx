"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { updateProfile, type ProfileFormState } from "@/lib/actions/profile"
import { useActionState } from "react"

type ProfileScreenProps = {
  name: string
  email: string
  memberCount: number
  createdAt: string
}

const initialState: ProfileFormState = {
  status: "idle",
  message: "",
}

export function ProfileScreen({ name, email, memberCount, createdAt }: ProfileScreenProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <AppShell
      title="Profile"
      subtitle="Coach account details and gym configuration"
    >
      <form action={formAction}>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Coach Information</h2>

            {state.status === "success" ? (
              <p className="mt-2 border border-[#1a6e2e] bg-[#e6f7ea] px-2 py-1 text-xs text-[#1a6e2e] sm:text-sm">
                {state.message}
              </p>
            ) : state.status === "error" && !state.errors ? (
              <p className="mt-2 border border-[#b12525] bg-[#ffe9e9] px-2 py-1 text-xs text-[#7e1b1b] sm:text-sm">
                {state.message}
              </p>
            ) : null}

            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
              <label className="block">
                <span className="mb-1 block">Name</span>
                <input
                  name="name"
                  className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                  defaultValue={name}
                  disabled={isPending}
                />
                {state.errors?.name ? (
                  <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.name}</span>
                ) : null}
              </label>
              <label className="block">
                <span className="mb-1 block">Email</span>
                <input
                  name="email"
                  type="email"
                  className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                  defaultValue={email}
                  disabled={isPending}
                />
                {state.errors?.email ? (
                  <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.email}</span>
                ) : null}
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              <MotionButton type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Profile"}
              </MotionButton>
            </div>
          </FadeCard>

          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Account</h2>
            <ul className="mt-3 space-y-2 text-base leading-tight sm:text-2xl">
              <li>Role: Owner Coach</li>
              <li>Members: {memberCount} registered</li>
              <li>Created: {createdAt}</li>
            </ul>
          </FadeCard>
        </div>
      </form>
    </AppShell>
  )
}
