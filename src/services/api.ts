import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import AuthService from './auth'
import { BaseResponse } from './types/base'

const baseURL = import.meta.env.VITE_API_URL
console.log(baseURL)

type AnyRecord<T extends string | number | symbol = string> = Record<T, any>

export class ApiErrorResponse extends Error {
  public statusCode

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export interface Option {
  body?: AnyRecord
  hasAuth?: boolean
  headers?: AnyRecord
  params?: AnyRecord
}

const handleApiResponse = (
  _: AxiosRequestConfig,
  resp: AxiosResponse<BaseResponse<any>>,
  resolve: any,
  reject: any
) => {
  const statusCode = resp.data.code

  if (statusCode == 401) {
    reject(new ApiErrorResponse(201, resp.data.message))
    return
  }

  if (statusCode == 200) {
    resolve(resp.data)
    return
  }

  reject(new ApiErrorResponse(statusCode, resp.data.message))
}

export const getAuth = (hasAuth = false) =>
  hasAuth && AuthService.getToken()
    ? {
        Authorization: `Bearer ${AuthService.getToken()}`,
      }
    : {}

export const genHeader = (hasAuth = false, headers = {}) =>
  Object.assign(headers, getAuth(hasAuth))

const handleError = (err: any, reject: any) => {
  console.debug(err)
  reject(new Error('Something went wrong'))
}

export const request = async <T>(options: AxiosRequestConfig) => {
  return new Promise<BaseResponse<T>>((resolve, reject) => {
    axios
      .request<BaseResponse<T>>({
        baseURL,
        ...options,
      })
      .then((resp) => {
        handleApiResponse(options, resp, resolve, reject)
      })
      .catch((err) => handleError(err, reject))
  })
}

export const get = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: 'GET',
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    params: options?.params,
  }).then((data) => data.result)
}

export const post = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: 'POST',
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result)
}

export const put = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: 'PUT',
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result)
}

export const del = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: 'DELETE',
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result)
}

const Api = {
  get,
  post,
  put,
  del,
}

export default Api
