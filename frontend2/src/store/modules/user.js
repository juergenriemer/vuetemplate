import Model from "@/services/UserService";
import axios from "axios";

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
    const response = await Model.create(data);
    return true;
  },

  async login({ commit }, data) {
    const res = await Model.login(data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.userdata.username);
    if (res && res.data) {
      commit("addUser", res.data.userdata);
    }
    return res;
  },

  async logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    commit("removeUser");
    self.location.hash = "#/login";
  },

  async info({ commit }) {
    const username = localStorage.getItem("username");
    const res = await Model.info(username);
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
