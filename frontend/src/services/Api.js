import axios from "axios";
import appConfig from "../config.js";
var firstload = true;
window.csrf = null;
import Api from "@/services/Api";
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

export default () => {
  return http;
};
