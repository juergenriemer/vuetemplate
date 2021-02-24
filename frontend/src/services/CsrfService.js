var firstload = true;
import Api from "@/services/Api";
const Csrf = () => {
  // on first request we fetch the CSRF information
  if (firstload || !/_csrf/.test(document.cookie)) {
    firstload = false;
    return Api()
      .get("/csrf")
      .then(res => {
        Api().defaults.withCredentials = true;
        Api().defaults.headers.common["xsrf-token"] = res.data.csrf;
        return res;
      });
  } else {
    // from then on we return a resolved promise
    return Promise.resolve(true);
  }
};

export default Csrf;
