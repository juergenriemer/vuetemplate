import Vue from "vue";
import App from "./App";
import router from "./router";
import config from "./config.js";
import { format, formatDistance } from "date-fns";
import store from "@/store/index";

self.isLocal = localStorage.getItem("token") == "local";

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) {
  document.body.className = "is-safari";
}
Vue.config.productionTip = false;
export const bus = new Vue();
document.body.addEventListener("mouseup", evt => {
  bus.$emit("mouseup", evt);
});
document.body.addEventListener("keydown", evt => {
  bus.$emit("keydown", evt);
});

Vue.mixin({
  computed: {
    firstTimer() {
      return !!!localStorage.getItem("last-visit");
    },
    isLoggedIn() {
      return localStorage.getItem("token");
    },
    isLocal() {
      return self.isLocal; //localStorage.getItem("token") == "local";
    },
    curListId() {
      return this.$route.params.id;
    },
    listAdmin() {
      if (this.list && this.list.users) {
        let user = this.list.users.find(usr => usr.userId == userId);
        return user.role != "user";
      }
      return null;
    }
  },
  methods: {
    userById(userId, listId = this.curListId) {
      console.log(userId, listId);
      return store.getters.userById(listId, userId);
    },
    userIsMe(id) {
      return id == userId;
    },
    date(date) {
      date = date ? new Date(date) : new Date();
      return format(date, "dd MMMM yyyy");
    },
    ago(date) {
      date = date ? new Date(date) : new Date();
      return formatDistance(date, new Date());
    },
    objectId() {
      return "id" + new Date().getTime();
    },
    showError(message) {
      //debugger;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.warn(message);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      //if (status !== 401) alert("An error happened, corrid:\n\n" + uid);
    },
    userColor(userId) {
      const user = this.userById(userId);
      const str = user ? user.name : "Listle";
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
