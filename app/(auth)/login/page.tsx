import Link from 'next/link'

export const metadata = {
  title: 'Login | Power Gym App',
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <p className="text-gray-500 mb-4">Login page placeholder</p>
        <p className="text-sm text-gray-400">Demo credentials:</p>
        <p className="text-sm text-gray-400">Email: rob@launchpadphilly.org</p>
        <p className="text-sm text-gray-400 mb-4">Password: password123</p>

        <div className="border-t pt-4 mt-4">
          <p className="text-sm font-medium text-gray-600 mb-3">Navigation test links</p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard"
              className="text-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Dashboard
            </Link>
            <Link
              href="/workouts"
              className="text-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Workouts
            </Link>
            <Link
              href="/analytics"
              className="text-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Analytics
            </Link>
            <Link
              href="/ai"
              className="text-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
