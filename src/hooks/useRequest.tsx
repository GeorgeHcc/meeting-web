import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";

export interface TypedRequestConfig extends AxiosRequestConfig {
  retry?: number;
}

export const useRequest = (config?: TypedRequestConfig) => {
  const [instance, setInstance] = useState<AxiosInstance | null>(null);

  const internalConfig = useMemo(
    () => ({
      ...{
        baseURL: `${import.meta.env.VITE_API_URL}`,
        timeout: 4000,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
        },
      },
      ...config,
    }),
    [config]
  );
  useEffect(() => {
    const axiosInstance = axios.create(internalConfig);
    axiosInstance.options
    //请求拦截
    axiosInstance.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (refreshToken && !config.url?.includes("/refresh")) {
        config.headers["x-refresh-token"] = refreshToken;
      }
      return config;
    });
    //响应拦截
    axiosInstance.interceptors.response.use(
      (response) => {
        const newAccessToken = response.headers["x-access-token"];
        const newRefreshToken = response.headers["x-refresh-token"];
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        return response;
      },
      async (error) => {
        console.log("request error:", error);
        // const originalRequest = error.config;
        // if (error.response && error.response.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;
        //   const newAccessToken = await refreshTokens(); // 刷新token的函数
        //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //   return axios(originalRequest);
        // }
        return Promise.reject(error);
      }
    );

    setInstance(axiosInstance);

    // axiosInstance.get("/test").then((res) => console.log("test :", res.data));
  }, [internalConfig]);

  return instance;
};

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
  },
});
