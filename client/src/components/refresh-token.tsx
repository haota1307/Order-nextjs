'use client'

import authApiRequest from '@/app/apiRequests/auth'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from '@/lib/utils'
import { decode } from 'jsonwebtoken'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Những page sẽ không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null
    const checkAndRefreshToken = async () => {
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
      // TH1: refresh token hết hạn
      if (decodeRefreshToken.exp <= now) return
      // TH2: Thời gian hết hạn của access token < 1/3 thì xử lý
      if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
        try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
        } catch (error) {
          clearInterval(interval)
        }
      }
    }
    checkAndRefreshToken()
    interval = setInterval(checkAndRefreshToken, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return null
}
