import Auth from "./auth";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const commonParams = {};
export default function Fetch(endPoint, params = {}, option = {}, isFile = false) {
  const method = option?.method ?? "get";
  const inFormData = option?.inFormData ?? false; // formType === true
  const isToken = option?.isToken ?? true;
  const url = option?.url;
  const baseURL = option?.baseURL ?? apiUrl;
  let parameters = {
    ...commonParams,
    ...params,
  };
  const FetchHeader = (token) => {
    const headers = {
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
  const convertToForm = () => {
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

  const fetch = (token) => {
    return axios[method](
      url ? url : baseURL + endPoint,
      inFormData
        ? convertToForm()
        : Object.keys(parameters)?.length
          ? parameters
          : FetchHeader(token),
      FetchHeader(token)
    )
      .then((d) => {
        let dataParse;

        if (isFile) {
          const content = d.headers["content-disposition"];
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(content);
          const filename = matches[1].replace(/['"]/g, "").trim();
          dataParse = { data: d.data, status: true, filename: filename };
        } else {
          dataParse = { data: d.data, status: true };
        }

        return dataParse;
      })
      .catch(async (err) => {
        if (err?.response?.status === 500) {
          return { internalServerError: ["Something went wrong."], status: false };
        } else if (err?.response?.status === 401) {
          let errRes = {}
          const newToken = await refreshToken();
          if (newToken === 'expired') {
            window.location.href = "/login";
            errRes = { err: ["expired"], status: false };
          } else if (newToken) {
            errRes = await fetch(newToken);
          } else {
            errRes = { unauthorized: ["Your session has expired. Please log in again to continue."], status: false };
          }

          return errRes
        } else {
          return { ...err?.response?.data, status: false };
        }
      });
  };
  if (isToken === false) {
    return fetch(isToken);
  }
  return Auth.getAsyncToken().then((res) => fetch(res.token));
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (refresh_token) {
    let expTime = decodeToken(refresh_token);
    let expireToken = isTokenExpired(expTime)
    if (expireToken) {
      localStorage.clear();
      return 'expired';
    }
  }
  if (refresh_token) {
    const refreshResponse = await axios.post(
      `${apiUrl}accounts/refresh/`,
      { refresh: refresh_token }
    );
    if (refreshResponse?.data?.access) {
      const newToken = refreshResponse.data.access;
      // const newRefreshToken = refreshResponse.data?.refresh
      // localStorage.setItem("refresh_token") = newRefreshToken
      localStorage.setItem("token", newToken);
      return newToken;
    } else {
      return null;
    }
  }
}
export const isTokenExpired = (token) => {
  const expirationTime = token.exp;

  const currentTime = Math.floor(Date.now() / 1000);
  return expirationTime < currentTime;
}
export const decodeToken = (token) => {
  const a = token.split('.')[1];
  const b = a.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(b).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
