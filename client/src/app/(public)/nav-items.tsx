'use client'

import { useAppContext } from '@/components/app-provider'
import Link from 'next/link'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true,
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false, // chưa đăng nhập thì hiển thị
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true, // đăng nhập rồi thì hiển thị
  },
]
// Server: Món ăn, đăng nhập (do không biết trạng thái đăng nhập của user)
// Client: Món ăn, đăng nhập. Nhưng ngay sau đó Món ăn, đơn hàng, quản lý (do đã check được trạng thái đăng nhập)
// => xung đột trạng thái Server và Client -> dùng useState, useEffect để giải quyết

export default function NavItems({ className }: { className?: string }) {
  const { isAuth } = useAppContext()
  return menuItems.map((item) => {
    if ((item.authRequired === false && isAuth) || (item.authRequired === true && !isAuth))
      return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
