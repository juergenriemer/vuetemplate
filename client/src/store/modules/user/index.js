import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

// REF: change to user
const root = "/users";

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
  short: (state) =>
    state.user.firstName.charAt(0) + state.user.lastName.charAt(0),
  token: () => localStorage.getItem("token"),
};

const actions = {
  async registerUser({ commit }, creds) {
    return http().post(`${root}/register`, creds);
  },

  async registerVerifyResend({ commit }, email) {
    return http().post(`${this.root}/registerVerifyResend`, email);
  },

  async registerVerify({ commit }, token) {
    return http()
      .get(`${root}/registerVerify/${token}`)
      .then((res) => {
        commit("fetchUser", res.data.token);
        commit("setToken", res.data.token);
        return res;
      });
  },

  async resetPassword({ commit }, data) {
    return http().post(`${root}/resetPassword`, data);
  },

  async resetPasswordVerify({ commit }, token) {
    return http()
      .get(`${root}/resetPasswordVerify/${token}`)
      .then((res) => {
        commit("fetchUser", res.data.userdata);
        commit("setToken", res.data.token);
        return res;
      });
  },

  async login({ commit }, creds) {
    return http()
      .post(`${root}/login`, creds)
      .then((res) => {
        if (res && res.data) {
          commit("fetchUser", res.data.user);
          commit("setToken", res.data.token);
        }
        return res;
      });
  },

  async social({ commit }, token) {
    return http()
      .get(`${root}/social/${token}`)
      .then((res) => {
        if (res && res.data) {
          commit("fetchUser", res.data.user);
          commit("setToken", res.data.token);
        }
        return res;
      });
  },

  async info({ commit, getters }) {
    if (wire(arguments)) {
      return http()
        .get(`${root}/info`)
        .then((res) => {
          const user = res.data.user;
          const tzo = res.data.tzo + new Date().getTimezoneOffset();
          window.tzo = tzo * -1;
          commit("fetchUser", { user });
          return res;
        });
    }
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

  async deleteUser({ commit, getters }, creds) {
    if (wire(arguments)) {
      return http()
        .post(`${root}/delete`, creds)
        .then((res) => {
          return res;
        });
    }
  },

  async deleteUserVerify({ commit }, token) {
    if (wire(arguments)) {
      return http()
        .get(`${root}/deleteVerify/${token}`)
        .then((res) => {
          commit("deleteUser");
          return res;
        });
    }
  },
};

const mutations = {
  fetchUser: (state, { user }) => {
    state.user = user;
  },
  removeUser: (state) => (state.user = null),
  setToken: (state, token) => {
    localStorage.setItem("last-visit", new Date());
    localStorage.setItem("token", token);
  },
  clearUser: (state) => (state.user = {}),
  deleteUser: (state) => {
    localStorage.removeItem("token");
    localStorage.removeItem("store");
    var mydate = new Date();
    mydate.setTime(mydate.getTime() - 1);
    document.cookie = "_csrf=; expires=" + mydate.toGMTString();
  },
  logout: (state) => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("csrf");
    window.initialDataLoad = false;
    var mydate = new Date();
    mydate.setTime(mydate.getTime() - 1);
    document.cookie = "_csrf=; expires=" + mydate.toGMTString();
  },
  offlineUser: (state) => {
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
