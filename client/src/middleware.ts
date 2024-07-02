import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  // 1. Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }
  // 2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Đăng nhập rồi mà vẫn vào trang login -> redirect sang trang chủ
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // 2.2 Trường hợp access token hết hạn ở cookie (cookie tự xóa)
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    // 2.3 vào không đúng role -> redirect vè trang chủ
    const role = decodeToken(refreshToken).role
    if (
      (role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))) ||
      (role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login'],
}
