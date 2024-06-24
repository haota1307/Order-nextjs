import http from '@/lib/http'
import { LoginBodyType, LoginResType } from '@/schemaValidations/auth.schema'

const authApiRequest = {
  // Server login
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  // Client login (route handler - next server)
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: '',
    }),
}

export default authApiRequest
