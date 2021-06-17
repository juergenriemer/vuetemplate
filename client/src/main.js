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
import "./theme/layout.css";

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store);

app.component("base-layout", BaseLayout);
app.config.globalProperties.$networkStatus = "unknown";

app.mixin({
  data() {
    return {
      networkStatus: "unknown",
    };
  },
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
      router.push(path);
    },
    scrollToBottom(pageId) {
      this.$nextTick(() => {
        const page = document.querySelector(`#${pageId} ion-content`);
        page && page.scrollToBottom();
      });
    },
    showError(err) {
      if (err && err.message) {
        if (err.message == "network-error") {
          window.$$.network = "offline";
          window.bus.emit("network-status");
        }
      }
      console.warn("@@@@@@@@@@@@@@@@@@@@@@@");
      console.warn(err);
      console.warn("@@@@@@@@@@@@@@@@@@@@@@@");
    },
  },
});
router.isReady().then(() => {
  app.mount("#app");
});
