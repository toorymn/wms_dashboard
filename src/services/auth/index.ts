import { Account } from '@/context/auth'
import Api from '../api'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  jwtToken: string
  refreshToken: string
  account: Account
}



const authTokenKey =  'app.token'
const refreshToken = "refresh.token";



const AuthService = {
  hasToken: () => !!localStorage.getItem(authTokenKey),
  getToken: () => localStorage.getItem(authTokenKey),
  getRefreshToken: () => localStorage.getItem(refreshToken),
  removeToken: () => localStorage.removeItem(authTokenKey),
  saveToken: (token: string) => localStorage.setItem(authTokenKey, token),
  saveRefreshToken: (token: string) => {
    localStorage.setItem(refreshToken, token);
  },
  profile: () => Api.get<Account>("/auth/me", { hasAuth: true }),
  login: (body: LoginParams) =>
    Api.post<LoginResponse>("/auth/admin/login", {
      body,
    }),
};

export default AuthService
