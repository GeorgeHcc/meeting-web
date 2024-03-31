import axios, { AxiosInstance } from "axios";

const service :AxiosInstance= axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
  },
});

//请求拦截
service.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
  if (refreshToken && !config.url?.includes("/refresh")) {
    config.headers["x-refresh-token"] = refreshToken;
  }
  return config;
});
//响应拦截
service.interceptors.response.use((response) => {
  const newAccessToken = response.headers["x-access-token"];
  const newRefreshToken = response.headers["x-refresh-token"];

  if (newAccessToken) {
    localStorage.setItem("accessToken", newAccessToken);
  }
  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken);
  }
  return response;
});

export default service;
