import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";

const error = error => {
  alert(error);
};

a = {
  test: 1,
  g: { asdf: 2 }
};

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
