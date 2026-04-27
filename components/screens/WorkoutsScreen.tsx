"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { createWorkout, type WorkoutFormState } from "@/lib/actions/workouts"
import type { Member, Workout, WorkoutItem } from "@prisma/client"
import { useActionState } from "react"

type WorkoutWithItems = Workout & {
  member: Member
  items: WorkoutItem[]
}

type WorkoutsScreenProps = {
  members: Member[]
  workouts: WorkoutWithItems[]
}

const initialState: WorkoutFormState = {
  status: "idle",
  message: "",
}

export function WorkoutsScreen({ members, workouts }: WorkoutsScreenProps) {
  const [state, formAction, isPending] = useActionState(createWorkout, initialState)

  return (
    <AppShell
      title="Workouts"
      subtitle="Log sessions, track progression, and monitor coaching quality"
      actions={null}
    >
      <FadeCard>
        {state.status === "success" ? (
          <p className="border border-[#0d6d56] bg-[#ddf7ef] px-2 py-1 text-xs text-[#0a4f3f] sm:text-sm">{state.message}</p>
        ) : null}
        {state.status === "error" && !state.errors ? (
          <p className="border border-[#b12525] bg-[#ffe9e9] px-2 py-1 text-xs text-[#7e1b1b] sm:text-sm">{state.message}</p>
        ) : null}
      </FadeCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Log Workout</h2>
          <form action={formAction} className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
            <label className="sm:col-span-2">
              <span className="mb-1 block">Member</span>
              <select name="memberId" className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="">
                <option value="" disabled>Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              {state.errors?.memberId ? <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.memberId}</span> : null}
            </label>

            <label>
              <span className="mb-1 block">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
              />
            </label>

            <label>
              <span className="mb-1 block">Exercise</span>
              <input name="exerciseName" className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" placeholder="Back Squat" />
              {state.errors?.exerciseName ? <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.exerciseName}</span> : null}
            </label>

            <label>
              <span className="mb-1 block">Sets</span>
              <input name="sets" type="number" min={1} className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" placeholder="4" />
              {state.errors?.sets ? <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.sets}</span> : null}
            </label>

            <label>
              <span className="mb-1 block">Reps</span>
              <input name="reps" type="number" min={1} className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" placeholder="8" />
              {state.errors?.reps ? <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.reps}</span> : null}
            </label>

            <label>
              <span className="mb-1 block">Weight (lbs)</span>
              <input name="weight" type="number" min={0} step="0.5" className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" placeholder="185" />
              {state.errors?.weight ? <span className="mt-1 block text-[11px] text-[#b12525]">{state.errors.weight}</span> : null}
            </label>

            <label className="sm:col-span-2">
              <span className="mb-1 block">Notes</span>
              <textarea name="notes" rows={3} className="w-full border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" placeholder="Optional session notes" />
            </label>

            <div className="mt-1 flex flex-wrap gap-2 sm:col-span-2">
              <MotionButton type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Workout"}</MotionButton>
              <MotionButton type="submit" variant="secondary" disabled={isPending}>{isPending ? "Saving..." : "Save + Add Another"}</MotionButton>
            </div>
          </form>
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Session Snapshot</h2>
          <ul className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
            <li>Total Logged: {workouts.length}</li>
            <li>Members: {members.length}</li>
            <li>Latest Entry: {workouts[0] ? new Date(workouts[0].date).toLocaleDateString() : "None yet"}</li>
            <li>Status: {isPending ? "Saving workout..." : "Ready"}</li>
          </ul>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-xl leading-none sm:text-2xl">History (Newest First)</h2>
        {workouts.length === 0 ? (
          <p className="mt-3 text-xs sm:text-sm">No workouts logged yet. Submit your first session above.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-xs leading-tight sm:text-sm">
            {workouts.map((workout) => (
              <li key={workout.id} className="border border-[#89aed7] bg-white px-2 py-2">
                <p className="font-semibold">{workout.member.name} · {new Date(workout.date).toLocaleDateString()}</p>
                <ul className="mt-1 space-y-1">
                  {workout.items.map((item) => (
                    <li key={item.id}>
                      {item.exerciseName} - {item.sets}x{item.reps}
                      {item.weight !== null ? ` @ ${item.weight} lbs` : ""}
                    </li>
                  ))}
                </ul>
                {workout.notes ? <p className="mt-1 text-[#305175]">Notes: {workout.notes}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </FadeCard>
    </AppShell>
  )
}
