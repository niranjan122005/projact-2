import axios from 'axios'

// Base URL for JSON Server. Override with VITE_API_URL in a .env file if needed.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Normalizes axios errors into a readable message the UI can show directly.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the server. Make sure JSON Server is running on ' + API_BASE_URL + '.'
    }
    if (error.response) {
      return `Request failed (${error.response.status}). ${error.response.statusText || ''}`.trim()
    }
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
