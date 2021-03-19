import { createStore } from "vuex";
import list from "./modules/list/index";
import user from "./modules/user/index";
import VuexPersist from "vuex-persist";

const vuexLocal = new VuexPersist({
  key: "store",
  storage: window.localStorage,
});
const store = createStore({
  modules: {
    list,
    user,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
