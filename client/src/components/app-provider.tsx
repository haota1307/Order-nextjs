'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from '@/components/refresh-token'
import { getAccessTokenFromLocalStorage, removeTokeformLocalStorage } from '@/lib/utils'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Khi chuyển tab sang trang khác và ấn về thì ko bị fetch api laij
      refetchOnMount: false,
    },
  },
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuthState] = useState(false)
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) setIsAuthState(true)
  }, [])
  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeTokeformLocalStorage()
    }
  }, [])
  return (
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
