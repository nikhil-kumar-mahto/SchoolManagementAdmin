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
      .catch((err) => {
        if (err?.response?.status === 500) {
          return { err: ["Something Went axiosWrong"], status: false };
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
