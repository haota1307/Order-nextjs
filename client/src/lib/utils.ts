import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 * Ví dụ: /login -> login
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
