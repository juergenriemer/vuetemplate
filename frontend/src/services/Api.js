import axios from "axios";
import appConfig from "../config.js";
import { bus } from "@/main";
window.csrf = null;

const http = axios.create({
  baseURL: appConfig.backend,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
    credentials: "include",
    mode: "cors"
  }
});

const getCsrfToken = async () => {
  let csrf = sessionStorage.getItem("csrf");
  if (csrf) {
    return csrf;
  } else {
    const res = await fetch(`${appConfig.backend}/csrf`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      credentials: "include",
      mode: "cors"
    });
    const json = await res.json();
    sessionStorage.setItem("csrf", json.csrf);
    return true;
  }
};
const isLocal = () => localStorage.getItem("token") == "local";

http.interceptors.request.use(
  async config => {
    const value = await getCsrfToken();
    config.headers["xsrf-token"] = sessionStorage.getItem("csrf");
    config.headers["Authorization"] = localStorage.getItem("token");
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  res => res,
  err => {
    if (/Network Error/.test(err)) {
      bus.$emit("showOffline", true);
      return Promise.reject({ status: 0, message: "network-error" });
    }
    const status = err && err.response && err.response.status;
    if (status == 401) {
      self.location.hash = "#/login";
    }
    const uid =
      err && err.response && err.response.data && err.response.data.uid;
    const message =
      err && err.response && err.response.data && err.response.data.message;
    //      return Promise.reject(err);
    return Promise.reject({ status, message, uid });
  }
);
const wire = args => {
  if (self.isLocal || self.offline) return false;
  if (args && args[1] && args[1].socket) return false;
  return true;
};

export default {
  http: () => {
    return http;
  },
  wire
};
