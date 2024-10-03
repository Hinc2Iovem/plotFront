import { AxiosError } from "axios";
import { createContext, useLayoutEffect, useState } from "react";
import { axiosCustomized } from "../../../api/axios";

type AuthContextTypes = {
  token: {
    accessToken: string;
  };
  setToken: React.Dispatch<React.SetStateAction<{ accessToken: string }>>;
};

export const AuthContext = createContext({} as AuthContextTypes);

type AuthProviderTypes = {
  children: React.ReactNode;
};

let refreshTokenPromise: Promise<any> | null = null;
// TODO will need to check if this actually works
export default function AuthProvider({ children }: AuthProviderTypes) {
  const [token, setToken] = useState({ accessToken: "" });

  useLayoutEffect(() => {
    const authInterceptor = axiosCustomized.interceptors.request.use(
      (config) => {
        config.headers.Authorization =
          !config._retry && token.accessToken
            ? `Bearer ${token.accessToken}`
            : config.headers.Authorization;
        return config;
      }
    );

    return () => {
      axiosCustomized.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosCustomized.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest?._retry) {
          if (!refreshTokenPromise) {
            refreshTokenPromise = (async () => {
              try {
                const response = await axiosCustomized.get(`/auth/refresh`);
                setToken({ accessToken: response.data.accessToken });
                return response.data.accessToken;
              } catch (error) {
                setToken({ accessToken: "" });
                throw error;
              } finally {
                refreshTokenPromise = null;
              }
            })();
          }

          try {
            const newAccessToken = await refreshTokenPromise;
            if (originalRequest) {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosCustomized(originalRequest);
            }
          } catch (error) {
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosCustomized.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
