export const metadata = {
  title: 'Dashboard | Power Gym App',
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-500">Dashboard placeholder</p>
      <nav className="mt-6 space-y-2">
        <a href="/workouts" className="block text-blue-600 hover:underline">Workouts</a>
        <a href="/analytics" className="block text-blue-600 hover:underline">Analytics</a>
        <a href="/ai" className="block text-blue-600 hover:underline">AI</a>
      </nav>
    </div>
  )
}
