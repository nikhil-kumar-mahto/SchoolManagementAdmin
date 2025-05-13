import Auth from "./auth";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const apiUrl = import.meta.env.VITE_API_URL as string;
const commonParams: Record<string, any> = {};

interface FetchOptions {
  method?: "get" | "post" | "put" | "delete" | "patch";
  inFormData?: boolean;
  isToken?: boolean;
  url?: string;
  baseURL?: string;
}

interface FetchResponse {
  data?: any;
  status: boolean;
  filename?: string;
  internalServerError?: string[];
  unauthorized?: string[];
}

export default function Fetch(
  endPoint: string,
  params: Record<string, any> = {},
  option: FetchOptions = {},
  isFile: boolean = false
): Promise<FetchResponse> {
  const method = option?.method ?? "get";
  const inFormData = option?.inFormData ?? false;
  const isToken = option?.isToken ?? true;
  const url = option?.url;
  const baseURL = option?.baseURL ?? apiUrl;

  let parameters: Record<string, any> = {
    ...commonParams,
    ...params,
  };

  const FetchHeader = (token: string | boolean): AxiosRequestConfig => {
    const headers: Record<string, string> = {
      "Content-Type": inFormData ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${token || ""}`,
    };

    if (!token) {
      delete headers["Authorization"];
    }

    return {
      headers,
      ...(isFile && { responseType: "blob" }),
    };
  };

  const convertToForm = (): FormData => {
    let formData = new FormData();
    for (let name in parameters) {
      if (Array.isArray(parameters[name])) {
        for (var i = 0; i < parameters[name].length; i++) {
          formData.append(`${name}`, parameters[name][i]);
        }
      } else {
        formData.append(name, parameters[name]);
      }
    }
    return formData;
  };

  const fetch = async (token: string | boolean): Promise<FetchResponse> => {
    try {
      const response: AxiosResponse = await axios[method](
        url ? url : baseURL + endPoint,
        inFormData
          ? convertToForm()
          : Object.keys(parameters)?.length
          ? parameters
          : FetchHeader(token),
        FetchHeader(token)
      );

      let dataParse: FetchResponse;

      if (isFile) {
        const content = response.headers["content-disposition"];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(content);
        const filename = matches?.[1]?.replace(/['"]/g, "").trim();
        dataParse = { data: response.data, status: true, filename: filename };
      } else {
        dataParse = { data: response.data, status: true };
      }

      return dataParse;
    } catch (err: any) {
      if (err?.response?.status === 500) {
        return {
          internalServerError: ["Something went wrong."],
          status: false,
        };
      } else if (err?.response?.status === 401) {
        const event = new CustomEvent("unauthorizedError", {
          detail: { message: "Unauthorized access" },
        });
        window.dispatchEvent(event);
        return {
          unauthorized: [
            "Your session has expired. Please log in again to continue.",
          ],
          status: false,
        };
      } else {
        return { ...err?.response?.data, status: false };
      }
    }
  };

  if (isToken === false) {
    return fetch(isToken);
  }

  return Auth.getAsyncToken().then((res) => fetch(res.token));
}

export async function refreshToken(): Promise<string | null | "expired"> {
  const refresh_token = localStorage.getItem("refresh_token");
  if (refresh_token) {
    const expTime = decodeToken(refresh_token);
    const expireToken = isTokenExpired(expTime);

    if (expireToken) {
      localStorage.clear();
      return "expired";
    }
  }

  if (refresh_token) {
    const refreshResponse = await axios.post(`${apiUrl}accounts/refresh/`, {
      refresh: refresh_token,
    });

    if (refreshResponse?.data?.access) {
      const newToken = refreshResponse.data.access;
      localStorage.setItem("token", newToken);
      return newToken;
    } else {
      return null;
    }
  }
  return null;
}

export const isTokenExpired = (token: { exp: number }): boolean => {
  const expirationTime = token.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime < currentTime;
};

export const decodeToken = (token: string): { exp: number } => {
  const a = token.split(".")[1];
  const b = a.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(b)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};
