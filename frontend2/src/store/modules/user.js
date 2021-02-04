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
  async register({ commit }, data) {
    const res = await User.register(data);
    return res;
  },
  async verifyRegistration({ commit }, token) {
    const res = await User.verifyRegistration(token);
    return res;
  },

  async login({ commit }, data) {
    const res = await User.login(data);
    console.warn(data);
    console.warn(res);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.userdata.username);
    localStorage.setItem("userid", res.data.userdata._id);
    if (res && res.data) {
      commit("addUser", res.data.userdata);
    }
    return res;
  },

  async logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");
    commit("removeUser");
    self.location.hash = "#/login";
  },

  async info({ commit }) {
    // do I need this method? I should have everything in local storage, no?
    // need it because name might have changed on pc _and_ lsatSeen data?
    const username = localStorage.getItem("username");
    const res = await User.info(username);
    if (res && res.data) {
      commit("addUser", res.data.userdata);
    }
    return res;
  }
};

const mutations = {
  addUser: (state, user) => (state.user = user),
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
