import Vuex from "vuex";
import Vue from "vue";
import list from "./modules/list/index";
import user from "./modules/user/index";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    list,
    user
  }
});
