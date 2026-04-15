export const metadata = {
  title: 'Workouts | Power Gym App',
}

export default function WorkoutsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Workouts</h1>
      <p className="text-gray-500">Workout tracking placeholder</p>
      <a href="/dashboard" className="block mt-4 text-blue-600 hover:underline">Back to Dashboard</a>
    </div>
  )
}
