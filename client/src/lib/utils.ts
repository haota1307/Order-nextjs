import authApiRequest from '@/app/apiRequests/auth'
import { toast } from '@/components/ui/use-toast'
import { EntityError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { decode } from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
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

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message,
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000,
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}
export const setAccessTokenToLocalStorage = (accessToken: string) => {
  return isBrowser && localStorage.setItem('accessToken', accessToken)
}
export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  return isBrowser && localStorage.setItem('refreshToken', refreshToken)
}
export const removeTokeformLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  /**
   * Không nên đưa logic lấy AT và RT ra ngoài func checkAndRefreshToken
   * Vì mỗi lần checkAndRefreshToken() được gọi sẽ lấy ra giá trị mới => tránh bug lấy giá trị đã bị cũ
   */
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodeAccessToken = decode(accessToken) as { exp: number; iat: number }
  const decodeRefreshToken = decode(refreshToken) as { exp: number; iat: number }
  /**
   * Thời điểm hết hạn (exp) được tính theo epoch time (s)
   * còn new Date().getTime() thì nó sẽ trả về epoch time (ms)
   */
  const now = Math.round(new Date().getTime() / 1000)
  // TH1: refresh token hết hạn => logout
  if (decodeRefreshToken.exp <= now) {
    removeTokeformLocalStorage()
    return param?.onError && param.onError()
  }
  // TH2: Thời gian hết hạn của access token < 1/3 thì xử lý
  if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
