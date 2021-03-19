import Api from "@/services/Api.js";
const wire = Api.wire;
const http = Api.http;

const root = "/list";

const getters = {};

const actions = {
  async addList({ commit }, { list }) {
    commit("addList", { list });
    if (wire(arguments))
      return http()
        .post(`${root}`, list)
        .then((res) => {
          // second update for the ID of the item
          commit("updateList", {
            listId: list._id,
            list: res.data.list,
          });
          return res;
        });
  },

  async updateList({ commit }, { listId, list }) {
    commit("updateList", { listId, list });
    if (wire(arguments)) return http().put(`/list/${listId}`, list);
  },

  async removeList({ commit }, { listId }) {
    commit("removeList", { listId });
    if (wire(arguments)) return http().delete(`${root}/${listId}`);
  },

  async fetchLists({ commit }) {
    if (wire(arguments))
      return http()
        .get(`${root}`)
        .then((res) => {
          commit("fetchLists", { lists: res.data.lists });
          return res;
        });
  },

  async sawList({ commit }, { listId, userId }) {
    commit("sawList", { listId, userId });
    if (wire(arguments)) return http().put(`${root}/sawList/${listId}`);
  },

  async resetList({ commit }, { listId }) {
    commit("resetList", { listId });
    if (wire(arguments)) return http().put(`${root}/reset/${listId}`);
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    if (!self.isLocal)
      return http().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  },
};

const mutations = {
  clearLists: (state) => (state.lists = []),
  fetchLists: (state, { lists }) => (state.lists = lists),
  addList: (state, { list }) => state.lists.unshift(list),
  updateList: (state, { listId, list }) => {
    const listIx = state.lists.findIndex((lst) => lst._id == listId);
    Object.assign(state.lists[listIx], list);
  },
  removeList: (state, { listId }) =>
    (state.lists = state.lists.filter((lst) => lst._id !== listId)),
  sawList: (state, { listId, userId }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.lastSeen = new Date();
  },
  resetList: (state, { listId }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.items.forEach((item) => (item.done = false));
  },
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
};

export default {
  getters,
  actions,
  mutations,
};
