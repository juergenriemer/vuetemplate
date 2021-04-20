import User from "@/services/UserService";
import Api from "@/services/Api";

const state = {
  user: [],
};

const getters = {
  user: (state) => state.user,
  juserId: (state) => (state.user ? state.user._id : null),
  userId: (state) => {
    return state.user && state.user._id ? state.user._id : null;
  },
  isLoggedIn: () => localStorage.getItem("token"),
  isLocal: () => localStorage.getItem("token") == "local",
  short: (state) =>
    state.user.firstName.charAt(0) + state.user.lastName.charAt(0),
  token: () => localStorage.getItem("token"),
};

const actions = {
  async registerUser({ commit }, data) {
    return User.register(data).then((res) => res);
  },

  async registerVerifyResend({ commit }, email) {
    return User.registerVerifyResend(email).then((res) => res);
  },

  async registerVerify({ commit }, token) {
    return User.registerVerify(token).then((res) => {
      commit("fetchUser", res.data.token);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async resetPassword({ commit }, data) {
    return User.resetPassword(data).then((res) => res);
  },

  async resetPasswordVerify({ commit }, token) {
    return User.resetPasswordVerify(token).then((res) => {
      commit("fetchUser", res.data.userdata);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async login({ commit }, data) {
    return User.login(data).then((res) => {
      if (res && res.data) {
        commit("fetchUser", res.data.userdata);
        commit("setToken", res.data.token);
      }
      return res;
    });
  },

  async info({ commit, getters }) {
    return User.info(getters.userId).then((res) => {
      if (res && res.data) {
        // need to set userId to use this object like any other member
        res.data.user.userId = res.data.user._id;
        commit("fetchUser", res.data.user);
      }
      return res;
    });
  },

  async logout({ commit }) {
    self.location.hash = "#/login";
    setTimeout(() => {
      commit("clearLists");
      commit("clearUser");
      commit("logout");
    }, 500);
  },

  offlineUser({ commit }) {
    commit("offlineUser");
  },
};

const mutations = {
  fetchUser: (state, user) => (state.user = user),
  removeUser: (state) => (state.user = null),
  setToken: (state, token) => {
    self.isLocal = false;
    localStorage.setItem("last-visit", new Date());
    localStorage.setItem("token", token);
  },
  clearUser: (state) => (state.user = {}),
  logout: (state) => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("csrf");
    window.initialDataLoad = false;
    var mydate = new Date();
    mydate.setTime(mydate.getTime() - 1);
    document.cookie = "_csrf=; expires=" + mydate.toGMTString();
  },
  offlineUser: (state) => {
    self.isLocal = true;
    state.user = {
      firstName: "Local",
      lastName: "Listle",
      _id: "local",
    };
    localStorage.setItem("token", "local");
    localStorage.setItem("last-visit", new Date());
  },
};
//Api().defaults.headers.common["Authorization"] = token;

export default {
  state,
  getters,
  actions,
  mutations,
};
