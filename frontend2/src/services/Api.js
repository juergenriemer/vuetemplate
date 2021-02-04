import axios from "axios";

export default () => {
  const http = axios.create({
    baseURL: `http://10.0.0.199:3003`,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  });
  http.interceptors.response.use(
    res => {
      // Do something with response data
      return res;
    },
    error => {
      if (
        error &&
        error.response &&
        error.response.status &&
        error.response.status == 401
      ) {
        let hash = self.location.hash;
        let login = "#/login";
        let next = "";
        if (hash != login) {
          next = `${login}#next=${hash}`;
        }
        if (!/\/login/.test(hash)) self.location.hash = `${next}`;
      } else if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        // return error to caller if explicitly set
        return error.response.data.error;
      } else {
        console.log("ERR>>>>>>>>>>>>>>: ", error);
        if (error.response) return Promise.reject(error);
      }
    }
  );
  return http;
};
