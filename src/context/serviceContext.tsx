import axios, { AxiosInstance } from "axios";
import { createContext, startTransition, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ServiceContext = createContext<AxiosInstance | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const service: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 4000,
    
    withCredentials: true,
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
    console.log("response", response);
    if (response.status === 401) {
      console.log("111111111111111111");
      //   startTransition(() => {
      navigate("/login");
      //   });
    }
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }
    return response;
  });

  return <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>;
};

export const useService = () => {
  const service = useContext(ServiceContext);
  if (!service) {
    throw new Error("useService must be used within a ServiceProvider");
  }

  return service;
};
