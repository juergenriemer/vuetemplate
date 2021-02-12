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
    const res = await User.register(data);
    return res;
  },
  async verifyRegistration({ commit }, token) {
    const res = await User.verifyRegistration(token);
    if (res && res.data && res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("firstName", res.data.userdata.firstName);
      localStorage.setItem("lastName", res.data.userdata.lastName);
      localStorage.setItem("userid", res.data.userdata._id);
      return res;
    } else {
      throw new Error("auth failed");
    }
  },

  async login({ commit }, data) {
    const res = await User.login(data);
    console.log(res);
    if (res && res.data && res.data.userdata) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("firstName", res.data.userdata.firstName);
      localStorage.setItem("lastName", res.data.userdata.lastName);
      localStorage.setItem("userid", res.data.userdata._id);
      commit("addUser", res.data.userdata);
      return res;
    } else {
      throw new Error("auth failed");
    }
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
    const res = await User.info(userid);
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
