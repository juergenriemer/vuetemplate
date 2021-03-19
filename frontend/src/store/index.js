import Vuex from "vuex";
import Vue from "vue";
//import list from "./modules/list/index";
import user from "./modules/user/index";
import VuexPersist from "vuex-persist";

const vuexLocal = new VuexPersist({
  key: "store",
  storage: window.localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    list,
    user
  },
  plugins: [vuexLocal.plugin]
});
