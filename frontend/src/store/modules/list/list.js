import Api from "@/services/Api";

const root = "/list";

const getters = {};

const actions = {
  async addList({ commit }, { list, socket }) {
    commit("addList", { list });
    if (!socket)
      return Api()
        .post(`${root}`, list)
        .then(res => {
          // second update for the ID of the item
          commit("updateList", {
            listId: list._id,
            list: res.data.list
          });
          return res;
        });
  },

  async updateList({ commit }, { listId, list, socket }) {
    commit("updateList", { listId, list });
    if (!socket) return Api().put(`/list/${listId}`, list);
  },

  async removeList({ commit }, { listId, socket }) {
    commit("removeList", listId);
    if (!socket) return Api().delete(`${root}/${listId}`);
  },

  async fetchLists({ commit }) {
    return Api()
      .get(`${root}`)
      .then(res => {
        commit("fetchLists", { lists: res.data.lists });
        return res;
      });
  },

  async sawList({ commit }, listId) {
    commit("sawList", { listId });
    return Api().put(`${root}/sawList/${listId}`);
  },

  async resetList({ commit }, { listId, socket }) {
    commit("resetList", { listId });
    if (!socket) return Api().put(`${root}/reset/${listId}`);
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    return Api().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  }
};

const mutations = {
  fetchLists: (state, { lists }) => (state.lists = lists),
  addList: (state, { list }) => state.lists.unshift(list),
  updateList: (state, { listId, list }) => {
    const listIx = state.lists.findIndex(lst => lst._id == listId);
    Object.assign(state.lists[listIx], list);
  },
  removeList: (state, { listId }) =>
    (state.lists = state.lists.filter(lst => lst._id !== listId)),
  sawList: (state, { listId }) => {
    const list = state.lists.find(list => list._id == listId);
    const userId = localStorage.getItem("userid");
    let user = list.users.find(usr => usr.userId == userId);
    user.lastSeen = new Date();
  },
  resetList: (state, { listId }) => {
    const list = state.lists.find(list => list._id == listId);
    list.items.forEach(item => (item.done = false));
  },
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find(list => list._id == listId);
    let user = list.users.find(usr => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  }
};

export default {
  getters,
  actions,
  mutations
};
