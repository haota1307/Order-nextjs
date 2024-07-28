'use client'

import { useAppContext } from '@/components/app-provider'
import { toast } from '@/components/ui/use-toast'
import { decodeToken, generateSocketInstace } from '@/lib/utils'
import { useSetTokenToCookieMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function OAuthPage() {
  const { setRole, setSocket } = useAppContext()
  const { mutateAsync } = useSetTokenToCookieMutation()

  const router = useRouter()
  const searchParams = useSearchParams()

  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')

  const count = useRef(0)

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken)
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role)
            setSocket(generateSocketInstace(accessToken))
            router.push('/manage/dashboard')
          })
          .catch((e) => {
            toast({
              title: 'Đăng nhập thất bại',
              description: e.message || 'Có lỗi xảy ra',
              variant: 'destructive',
            })
          })
        count.current++
      }
    } else {
      console.log(message)
      toast({
        title: 'Đăng nhập thất bại',
        description: message || 'Có lỗi xảy ra',
        variant: 'destructive',
      })
    }
  }, [
    accessToken,
    refreshToken,
    setRole,
    router,
    setSocket,
    message,
    mutateAsync,
  ])
  return <div />
}
