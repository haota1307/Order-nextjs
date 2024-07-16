import authApiRequest from '@/apiRequests/auth'
import { decode } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      { message: 'Không lấy được refresh token' },
      { status: 401 }
    )
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken })
    const decodeAccessToken = decode(payload.data.accessToken) as {
      exp: number
    }
    const decodeRefreshToken = decode(payload.data.refreshToken) as {
      exp: number
    }
    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: new Date(decodeAccessToken.exp * 1000),
    })
    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: new Date(decodeRefreshToken.exp * 1000),
    })
    return Response.json(payload)
  } catch (error: any) {
    Response.json(
      { message: error.message ?? 'Có lỗi xảy ra' },
      { status: 401 }
    )
  }
}
