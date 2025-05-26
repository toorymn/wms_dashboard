import { Account } from '@/context/auth'
import Api from '../api'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  jwtToken: string
  account: Account
}


const authTokenKey =  'app.token'


const AuthService = {
  hasToken: () => !!localStorage.getItem(authTokenKey),
  getToken: () => localStorage.getItem(authTokenKey),
  removeToken: () => localStorage.removeItem(authTokenKey),
  saveToken: (token: string) =>
    localStorage.setItem(authTokenKey, token),
  profile: () => Api.get<Account>('/auth/me', { hasAuth: true }),
  login: (body: LoginParams) =>
    Api.post<LoginResponse>('/auth/admin/login', {
      body,
    }),
}

export default AuthService
