import Api from "@/services/Api.js";
const wire = Api.wire;
const http = Api.http;

const root = "/list";

const getters = {};

const actions = {
  async rawLists({ commit }) {
    return http()
      .get(`${root}`)
      .then((res) => {
        return res;
        //const server = [...res.data.lists];
      });
  },

  async addList({ commit, rootState }, { list }) {
    if (wire(arguments))
      return http()
        .post(`${root}`, list)
        .then((res) => {
          const list = res.data.list;
          commit("addList", { list });
          return res;
        });
    if (self.$$.network !== "online") list.offline = true;
    commit("addList", { list });
  },

  async updateList({ commit }, { listId, list }) {
    if (wire(arguments))
      return http()
        .put(`/list/${listId}`, list)
        .then((res) => {
          const list = res.data.list;
          commit("updateList", { listId, list });
          return res;
        });
    if (self.$$.network !== "online") list.offline = true;
    commit("updateList", { listId, list });
  },

  async deleteList({ commit }, { listId }) {
    if (wire(arguments))
      return http()
        .delete(`${root}/${listId}`)
        .then((res) => {
          commit("deleteList", { listId });
          return res;
        });
    commit("deleteList", { listId });
    window.storeAction(
      arguments,
      "deleteList",
      { listId },
      "delete list " + listId
    );
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

  async sawList({ commit, getter }, { listId, userId }) {
    commit("sawList", { listId, userId });
    if (wire(arguments)) return http().put(`${root}/sawList/${listId}`);
  },

  async toggleList({ commit }, { listId, done }) {
    if (wire(arguments))
      return http()
        .put(`${root}/toggle/${listId}/${done}`)
        .then((_) => {
          commit("toggleList", { listId, done });
        });
    window.storeAction(
      arguments,
      "toggleList",
      { listId, done },
      "toggle all items in " + listId
    );
    commit("toggleList", { listId, done });
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    if (!self.isLocal)
      return http().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  },

  async reorderList({ commit }, { listId, from, to }) {
    if (wire(arguments))
      return http()
        .put(`${root}/reorder/${listId}/${from}/${to}`)
        .then((_) => {
          commit("reorderList", { listId, from, to });
        });
    window.storeAction(
      arguments,
      "reorderList",
      { listId, from, to },
      "reorder list " + listId
    );
    commit("reorderList", { listId, from, to });
  },
};

const mutations = {
  clearLists: (state) => (state.lists = []),
  synchronize: (state, { lists }) => {},
  fetchLists: (state, { lists }) => (state.lists = lists),
  addList: (state, { list }) => {
    state.lists.unshift(list);
  },
  updateList: (state, { listId, list }) => {
    const listIx = state.lists.findIndex((lst) => lst._id == listId);
    Object.assign(state.lists[listIx], list);
  },
  deleteList: (state, { listId }) =>
    (state.lists = state.lists.filter((lst) => lst._id !== listId)),
  sawList: (state, { listId, userId }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.lastSeen = new Date();
  },
  toggleList: (state, { listId, done }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.items.forEach((item) => (item.done = done));
  },
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
  reorderList: (state, { listId, from, to }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const draggedItem = list.items.splice(from, 1)[0];
    list.items.splice(to, 0, draggedItem);
  },
};

export default {
  getters,
  actions,
  mutations,
};
