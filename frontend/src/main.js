import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import VueSocketIO from "vue-socket.io";
import config from "./config.js";

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
    connection: config.backend
  })
);

Vue.mixin({
  methods: {
    showError({ status, message, uid }) {
      if (status !== 401) alert("An error happened, corrid:\n\n" + uid);
    }
  }
});

import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";

Vue.use(WaveUI);

const waveui = new WaveUI({
  // Some Wave UI options.
});
new Vue({
  el: "#app",
  waveui,
  router,
  store,
  components: { App },
  template: "<App/>"
});

//Vue.prototype.socket = io("http://10.0.0.199:3003", {
//  withCredentials: true
//});
