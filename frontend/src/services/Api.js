import axios from "axios";
import config from "../config.js";

const http = axios.create({
  baseURL: config.backend,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
    credentials: "include",
    mode: "cors"
  }
});
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
