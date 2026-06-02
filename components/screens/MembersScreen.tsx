"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { createMember, type MemberFormState } from "@/lib/actions/members"
import { useRouter } from "next/navigation"
import { useActionState } from "react"

type Member = {
  id: string
  name: string
  email: string
  age: number | null
  goal: string | null
}

type MembersScreenProps = {
  members: Member[]
}

const initialState: MemberFormState = {
  status: "idle",
  message: "",
}

export function MembersScreen({ members }: MembersScreenProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createMember, initialState)

  return (
    <AppShell
      title="Members"
      subtitle="Manage gym members and add new athletes"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Add Member</h2>

          {state.status === "error" && !state.errors ? (
            <p className="mt-2 border border-[#b12525] bg-[#ffe9e9] px-2 py-1 text-xs text-[#7e1b1b] sm:text-sm">
              {state.message}
            </p>
          ) : null}

          <form action={formAction} className="mt-3 grid gap-2 text-xs sm:text-sm">
            <label className="block">
              <span className="mb-1 block">Name *</span>
              <input
                name="name"
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                placeholder="Sarah Lee"
                disabled={isPending}
              />
              {state.errors?.name ? (
                <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.name}</span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block">Email *</span>
              <input
                name="email"
                type="email"
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                placeholder="sarah@example.com"
                disabled={isPending}
              />
              {state.errors?.email ? (
                <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.email}</span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block">Age</span>
              <input
                name="age"
                type="number"
                min={1}
                max={120}
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                placeholder="28"
                disabled={isPending}
              />
              {state.errors?.age ? (
                <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.age}</span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block">Goal</span>
              <input
                name="goal"
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
                placeholder="Strength, weight loss, endurance..."
                disabled={isPending}
              />
            </label>

            <MotionButton type="submit" disabled={isPending} className="mt-1">
              {isPending ? "Adding..." : "Add Member"}
            </MotionButton>
          </form>
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">All Members</h2>
          {members.length === 0 ? (
            <p className="mt-3 text-sm text-[#4a7aab]">No members yet. Add your first member using the form.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#e2edf8]">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between py-2 text-sm sm:text-base">
                  <div>
                    <p className="font-medium text-[#0f3f75]">{member.name}</p>
                    <p className="text-xs text-[#4a7aab]">{member.email}</p>
                  </div>
                  <div className="text-right text-xs text-[#305175]">
                    {member.goal ? <p>{member.goal}</p> : null}
                    {member.age ? <p>Age {member.age}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {members.length > 0 ? (
            <div className="mt-4 border-t border-[#e2edf8] pt-3">
              <MotionButton variant="secondary" onClick={() => router.push("/workouts")}>
                Log a Workout
              </MotionButton>
            </div>
          ) : null}
        </FadeCard>
      </div>
    </AppShell>
  )
}
