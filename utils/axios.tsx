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
    if (response.headers["authorization"])
      localStorage.setItem("accessToken", response.headers["authorization"]);

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
  request.headers["authorization"] = localStorage.getItem("accessToken") || "";

  return request;
});

export default axiosClient;
