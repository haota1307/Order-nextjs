'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function RefreshToken() {
  const router = useRouter()
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
    } else {
      router.push('/login')
    }
  }, [router, refreshTokenFromUrl, redirectPathname])
  return <div>LogoutPage</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
