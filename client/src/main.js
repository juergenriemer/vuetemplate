import Vue from "vue";
import { createApp } from "vue";
import App from "./App.vue";
import BaseLayout from "./components/base/BaseLayout.vue";
import router from "./router";
import store from "./store";
import { IonicVue } from "@ionic/vue";

// bus: https://stackoverflow.com/a/64019074/463676
/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store);

app.component("base-layout", BaseLayout);

app.mixin({
  computed: {
    currentList() {
      const listId = this.$route.params.id;
      if (listId) {
        return this.$store.getters.list(listId);
      }
      return {};
    },
    currentItem() {
      const listId = this.$route.params.id;
      const itemId = this.$route.params.itemId;
      if (listId && itemId) {
        return this.$store.getters.item(listId, itemId);
      }
      return {};
    },
    viewMode() {
      return /^\/mob\//.test(router.currentRoute._value.path) ? "mob" : "web";
    },
  },
  created() {
    //this.ensureData();
  },
  methods: {
    test2() {
      const list = this.$store.getters.list(this.$route.params.id);
      return list.title;
    },
    nav(path) {
      const x = `/${this.viewMode}${path}`;
      //router.push({ path: x });
      router.push(path);
      //window.bus.emit("navigate", data);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        document.querySelector("#content-area").scrollToBottom();
      });
    },
    showError(err) {
      console.warn("@@@@@@@@@@@@@@@@@@@@@@@");
      console.warn(err);
      console.warn("@@@@@@@@@@@@@@@@@@@@@@@");
    },
    /*
    ensureData() {
      console.log(1, this.$store.getters.user.userId);
      if (!this.$store.getters.user.userId) {
        console.log("no userid");
        let route = router.currentRoute._value;
        if (route && route.params && route.params.mode == "app") {
          console.log("next path is app");
          store
            .dispatch("info")
            .then(() => {
              return store.dispatch("fetchLists");
            })
            .then((res) => {
              console.log("yay!");
            });
        } else {
          console.log("next is login!");
        }
      } else {
        console.log("all good!");
      }
    },
    */
  },
});
router.isReady().then(() => {
  app.mount("#app");
});
