import axios from "axios";
import mitt from "mitt";
window.bus = mitt();
window.csrf = null;

const http = axios.create({
  baseURL: process.env.VUE_APP_BACKEND,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
    credentials: "include",
    mode: "cors",
  },
});

const getCsrfToken = async () => {
  let csrf = sessionStorage.getItem("csrf");
  if (csrf) {
    return csrf;
  } else {
    const res = await fetch(`${process.env.VUE_APP_BACKEND}/csrf`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      credentials: "include",
      mode: "cors",
    });
    const json = await res.json();
    sessionStorage.setItem("csrf", json.csrf);
    return true;
  }
};
const isLocal = () => localStorage.getItem("token") == "local";

http.interceptors.request.use(
  async (config) => {
    const value = await getCsrfToken();
    config.headers["xsrf-token"] = sessionStorage.getItem("csrf");
    config.headers["Authorization"] = localStorage.getItem("token");
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
    const status = err && err.response && err.response.status;
    //if (/Network Error/.test(err)) {
    if (!status) {
      return Promise.reject({ status: 0, message: "network-error" });
    }
    if (status == 401) {
      self.location.href = "/user/login";
    }
    const uid =
      err && err.response && err.response.data && err.response.data.uid;
    const message =
      err && err.response && err.response.data && err.response.data.message;
    return Promise.reject({ status, message, uid });
  }
);
const wire = (args) => {
  if (window.$$.appMode !== "online" || window.$$.network == "offline")
    return false;
  if (args && args[1] && args[1].socket) return false;
  return true;
};

export default {
  http: () => {
    return http;
  },
  wire,
};
