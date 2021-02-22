import User from "@/services/UserService";

const state = {
  user: []
};

const getters = {
  user: state => {
    return state.user;
  }
};

const actions = {
  async registerUser({ commit }, data) {
    return User.register(data).then(res => {
      return res;
    });
  },
  async registerVerifyResend({ commit }, email) {
    return User.registerVerifyResend(email).then(res => {
      return res;
    });
  },

  async registerVerify({ commit }, token) {
    return User.registerVerify(token).then(res => {
      commit("addUser", res.data.token);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async resetPassword({ commit }, data) {
    return User.resetPassword(data).then(res => res);
  },

  async resetPasswordVerify({ commit }, token) {
    return User.resetPasswordVerify(token).then(res => {
      commit("addUser", res.data.token);
      commit("setToken", res.data.token);
      return res;
    });
  },

  async login({ commit }, data) {
    return User.login(data).then(res => {
      if (res && res.data) {
        commit("addUser", res.data.userdata);
        commit("setToken", res.data.token);
      }
    });
  },

  async logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userid");
    commit("removeUser");
    self.location.hash = "#/login";
  },

  async info({ commit }) {
    // do I need this method? I should have everything in local storage, no?
    // need it because name might have changed on pc _and_ lsatSeen data?
    const userid = localStorage.getItem("userid");
    return User.info(userid).then(res => {
      if (res && res.data) {
        commit("addUser", res.data.userdata);
      }
    });
  }
};

const mutations = {
  addUser: (state, user) => {
    state.user = user;
    localStorage.setItem("firstName", user.firstName);
    localStorage.setItem("lastName", user.lastName);
    localStorage.setItem("userid", user._id);
  },
  setToken: (state, token) => {
    localStorage.setItem("token", token);
  },
  removeUser: state => (state.user = null),
  updateUser: (state, item) => {
    console.warn(item);
    const index = state.todos.findIndex(todo => {
      console.log(todo);
      return todo._id == item._id;
    });
    if (index !== -1) {
      state.todos.splice(index, 1, item);
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
