import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import io from "socket.io-client";
import VueSocketIO from "vue-socket.io";
const error = error => {
  alert(error);
};

Vue.config.productionTip = false;
export const bus = new Vue();
/* remove below? */
/*
Vue.prototype.$http = Axios;
const accessToken = localStorage.getItem("access_token");
if (accessToken) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = accessToken;
}
*/
/* eslint-disable no-new */

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: "http://10.0.0.199:3003"
  })
);

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});

//Vue.prototype.socket = io("http://10.0.0.199:3003", {
//  withCredentials: true
//});
