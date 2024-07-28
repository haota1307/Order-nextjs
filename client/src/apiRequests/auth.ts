import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  // refreshTokenRequest tác dụng: fix gọi liên tục refresh token 2 lần khi chuyển trang
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,

  // Server login
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  // Client login (route handler - next server)
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, { baseUrl: '' }),
  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post(
      '/auth/logout',
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  // AT & RT tự động gửi qua cookie
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/auth/refresh-token',
      null,
      {
        baseUrl: '',
      }
    )
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
  setTokenToCookie: (body: { accessToken: string; refreshToken: string }) =>
    http.post('/api/auth/token', body, { baseUrl: '' }),
}

export default authApiRequest
