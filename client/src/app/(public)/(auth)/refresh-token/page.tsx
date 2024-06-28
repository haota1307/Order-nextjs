'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function RefreshTokenPage() {
  const router = useRouter()
  const ref = useRef<any>(null) // handle trường hợp '/logout' bị gọi 2 lần
  const searchParams = useSearchParams() // handle trường hợp bị bịp gửi link chứa route /logout
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        },
      })
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return <div>LogoutPage</div>
}
