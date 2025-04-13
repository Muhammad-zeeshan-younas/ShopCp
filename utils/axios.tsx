import axios, { AxiosRequestConfig } from "axios";
import { config } from "./config/config";
import { AppError } from "./error/AppError";

const throwError = (response: any) => {
  const message = response.data.message
    ? response.data.message
    : "Something went wrong, please try again later";

  throw new AppError(message);
};

const axiosClient = axios.create({
  baseURL: config().backend_url,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: any) => {
    if (config.headers["Content-Type"] === "multipart/form-data") {
      config.headers = {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const checkResponseStatus = (response: any, error: boolean = false) => {
  if (response === undefined) {
    throwError(response);
  }

  if (error) {
    throwError(response);
  }
};

axiosClient.interceptors.response.use(
  (response) => {
    if (response.headers.uid) localStorage.setItem("uid", response.headers.uid);
    if (response.headers["access-token"])
      localStorage.setItem("accessToken", response.headers["access-token"]);
    if (response.headers.client)
      localStorage.setItem("client", response.headers.client);
    if (response.headers.expiry)
      localStorage.setItem("expiry", response.headers.expiry);
    if (response.headers["token-type"])
      localStorage.setItem("tokenType", response.headers["token-type"]);

    checkResponseStatus(response);

    return response;
  },

  (error: any) => {
    let response = error.response;
    checkResponseStatus(response, true);

    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use((request) => {
  if (!request?.headers) return request;
  request.headers.uid = localStorage.getItem("uid") || "";
  request.headers["access-token"] = localStorage.getItem("accessToken") || "";
  request.headers.client = localStorage.getItem("client") || "";
  request.headers.expiry = localStorage.getItem("expiry") || "";
  request.headers.tokenType = localStorage.getItem("tokenType") || "Bearer";
  return request;
});

export default axiosClient;
