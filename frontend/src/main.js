import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/index";
import config from "./config.js";

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
  document.body.className = "is-safari";
}

Vue.config.productionTip = false;
export const bus = new Vue();

Vue.mixin({
  computed: {
    listAdmin() {
      if (this.list) {
        let user = this.list.users.find(
          usr => usr.userId == localStorage.getItem("userid")
        );
        return user.role != "user";
      }
      return null;
    }
  },
  methods: {
    showError({ status, message, uid }) {
      console.log(status, message, uid);
      if (status !== 401) alert("An error happened, corrid:\n\n" + uid);
    },
    avatarColor(str) {
      if (!str) str = "XXX";
      const s = 30;
      const l = 80;
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      var h = hash % 360;
      var textColor = l > 70 ? "#555" : "#fff";
      let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
      return color;
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
