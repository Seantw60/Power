// components/Navbar.tsx
export function Navbar() {
  return (
<>
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Power Gym</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/workouts" className="text-gray-600 hover:text-gray-900">Workouts</a>
            <a href="/analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
          </div>
        </div>
      </div>
    </nav>
</>
  )
}
