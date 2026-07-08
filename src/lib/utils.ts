import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { randomBytes } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return randomBytes(16).toString('hex')
}

export function generatePublicId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return '오류가 발생했습니다. 다시 시도해주세요.'
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export function createSuccessResponse<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  }
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  }
}
