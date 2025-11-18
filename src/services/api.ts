/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AuthService from "./auth";
import { BaseResponse } from "./types/base";

const baseURL = import.meta.env.VITE_API_URL;
console.log(baseURL);

type AnyRecord<T extends string | number | symbol = string> = Record<T, any>;

export class ApiErrorResponse extends Error {
  public statusCode;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export interface Option {
  body?: AnyRecord;
  hasAuth?: boolean;
  headers?: AnyRecord;
  params?: AnyRecord;
  timeout?: number;
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100 * 1000,
  timeoutErrorMessage: "Time out",
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      try {
        const refreshToken = await AuthService.getRefreshToken();
        if (!refreshToken) throw error;
        const resp = await axios.post(baseURL + "/auth/refresh-token", {
          refreshToken,
        });
        if (resp.data.code !== 200) {
          return Promise.reject(new Error(resp.data.message));
        }
        const newToken = resp.data?.result?.access_token;
        if (newToken) {
          await AuthService.saveToken(newToken);
          error.config.headers = error.config.headers || {};
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient.request(error.config);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.reload();
        // useAuthStore.getState().logOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const handleApiResponse = (
  _: AxiosRequestConfig,
  resp: AxiosResponse<BaseResponse<any>>,
  resolve: any,
  reject: any
) => {
  const statusCode = resp.data.code;

  if (statusCode == 401) {
    reject(new ApiErrorResponse(201, resp.data.message));
    return;
  }

  if (statusCode == 200) {
    resolve(resp.data);
    return;
  }

  reject(new ApiErrorResponse(statusCode, resp.data.message));
};

export const getAuth = (hasAuth = false) =>
  hasAuth && AuthService.getToken()
    ? {
        Authorization: `Bearer ${AuthService.getToken()}`,
      }
    : {};

export const genHeader = (hasAuth = false, headers = {}) =>
  Object.assign(headers, getAuth(hasAuth));

const handleError = (err: any, reject: any) => {
  console.debug(err);
  reject(new Error("Something went wrong"));
};

export const request = async <T>(options: AxiosRequestConfig) => {
  return new Promise<BaseResponse<T>>((resolve, reject) => {
    apiClient
      .request<BaseResponse<T>>({
        ...options,
        timeout: options.timeout || 100 * 1000,
      })
      .then((resp) => {
        handleApiResponse(options, resp, resolve, reject);
      })
      .catch((err) => handleError(err, reject));
  });
};

export const get = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: "GET",
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    params: options?.params,
  }).then((data) => data.result);
};

export const post = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: "POST",
    url,
    timeout: options?.timeout,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result);
};

export const put = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: "PUT",
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result);
};

export const del = async <T>(url: string, options?: Option): Promise<T> => {
  return request<T>({
    method: "DELETE",
    url,
    headers: genHeader(options?.hasAuth, options?.headers),
    data: options?.body,
  }).then((data) => data.result);
};

const Api = {
  get,
  post,
  put,
  del,
};

export default Api;
