import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function sanitizeRedirectPath(path: string | null | undefined): string {
  if (!path) return "/dashboard"

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard"
  }

  return path
}
