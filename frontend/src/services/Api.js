import axios from "axios";
import config from "../config.js";
/*
axios
  .create()
  .get("/csrf")
  .then(
    res => {
      console.log(">>>>>>>>>>>>>>>> " + res.data.csrfToken);
      http.defaults.headers.common["X-CSRF-TOKEN"] = res.data.csrfToken;
    },
    err => {
      console.log(err);
    }
  );
*/
const http = axios.create({
  baseURL: config.backend,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
    credentials: "include",
    mode: "cors",
    Cookie: document.cookie, //"_csrf=Lt9RED3GVWyvyuFSl3Scy8oS",
    "xsrf-token": localStorage.getItem("csrf"),
    withCredentials: true
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
http.get("/form").then(
  res => {
    console.log(res.data.csrf);
    localStorage.setItem("csrf", res.data.csrf);
    http.defaults.headers.common["xsrf-token"] = res.data.csrf;
  },
  err => {
    console.log(err);
  }
);
export default () => {
  return http;
};
