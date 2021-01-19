import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import Axios from "axios";

const error = error => {
  alert(error);
};

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
const accessToken = localStorage.getItem("access_token");
if (accessToken) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = accessToken;
}

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
