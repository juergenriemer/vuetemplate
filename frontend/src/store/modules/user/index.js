import User from "@/services/UserService";
import Api from "@/services/Api";

const state = {
  user: []
};

const getters = {
  user: state => state.user,
  juserId: state => (state.user ? state.user._id : null),
  userId: state => {
    console.log(5, state.user);
    console.log(10, state.user._id);
    return state.user._id;
  },
  isLoggedIn: () => localStorage.getItem("token"),
  isLocal: () => localStorage.getItem("token") == "local",
  short: state => state.short,
  token: () => localStorage.getItem("token")
};

const actions = {
  async registerUser({ commit }, data) {
    return User.register(data).then(res => res);
  },

  async registerVerifyResend({ commit }, email) {
    return User.registerVerifyResend(email).then(res => res);
  },

  async registerVerify({ commit }, token) {
    return User.registerVerify(token).then(res => {
      commit("fetchUser", res.data.token);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async resetPassword({ commit }, data) {
    return User.resetPassword(data).then(res => res);
  },

  async resetPasswordVerify({ commit }, token) {
    return User.resetPasswordVerify(token).then(res => {
      commit("fetchUser", res.data.userdata);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async login({ commit }, data) {
    return User.login(data).then(res => {
      if (res && res.data) {
        commit("fetchUser", res.data.userdata);
        commit("setToken", res.data.token);
      }
      return res;
    });
  },

  async info({ commit, getters }) {
    return User.info(getters.userId).then(res => {
      if (res && res.data) {
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
  }
};

const mutations = {
  fetchUser: (state, user) => (state.user = user),
  removeUser: state => (state.user = null),
  setToken: (state, token) => {
    self.isLocal = false;
    localStorage.setItem("last-visit", new Date());
    localStorage.setItem("token", token);
  },
  clearUser: state => (state.user = {}),
  logout: state => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("csrf");
    var mydate = new Date();
    mydate.setTime(mydate.getTime() - 1);
    document.cookie = "_csrf=; expires=" + mydate.toGMTString();
  },
  offlineUser: state => {
    self.isLocal = true;
    state.user = {
      firstName: "Local",
      lastName: "Listle",
      _id: "local"
    };
    console.log(3, state.user);
    localStorage.setItem("token", "local");
    localStorage.setItem("last-visit", new Date());
  }
};
//Api().defaults.headers.common["Authorization"] = token;

export default {
  state,
  getters,
  actions,
  mutations
};
