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

  async sawLists({ commit }) {
    if (wire(arguments))
      return http()
        .put(`${root}/saw`)
        .then((res) => {
          commit("sawLists", res.data);
        });
    // we are offline no need?? commit("sawList", { listId, userId,  });
  },

  async sawList({ commit }, { listId, userId, seen }) {
    commit("sawList", { listId, userId, seen });
  },

  async toggleList({ commit }, { listId, done, seen }) {
    if (wire(arguments))
      return http()
        .put(`${root}/toggle/${listId}/${done}`)
        .then((res) => {
          res.data.actor = true;
          commit("toggleList", res.data);
        });
    window.storeAction(
      arguments,
      "toggleList",
      { listId, done, seen },
      "toggle all items in " + listId
    );
    commit("toggleList", { listId, done, seen });
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    if (!self.isLocal)
      return http().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  },

  async reorderList({ commit }, { listId, from, to, seen }) {
    if (wire(arguments))
      return http()
        .put(`${root}/reorder/${listId}/${from}/${to}`)
        .then((res) => {
          res.data.actor = true;
          commit("reorderList", res.data);
        });
    window.storeAction(
      arguments,
      "reorderList",
      { listId, from, to, seen },
      "reorder list " + listId
    );
    commit("reorderList", { listId, from, to, seen });
  },
};

const mutations = {
  clearLists: (state) => (state.lists = []),
  synchronize: (state, { lists }) => {},
  fetchLists: (state, { lists }) => (state.lists = lists),
  listUpdated: (state, { listId, updatedAt }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.updatedAt = updatedAt;
  },
  addList: (state, { list }) => {
    state.lists.unshift(list);
  },
  updateList: (state, { listId, list }) => {
    const listIx = state.lists.findIndex((lst) => lst._id == listId);
    Object.assign(state.lists[listIx], list);
  },
  deleteList: (state, { listId }) =>
    (state.lists = state.lists.filter((lst) => lst._id !== listId)),

  sawLists: (state, { userId, seen }) => {
    state.lists.forEach((lst) => {
      lst.lastSeen.find((usr) => usr.userId == userId).seen = seen;
    });
  },
  sawList: (state, { listId, userId, seen }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    let userIx = list.lastSeen.findIndex((elem) => elem.userId == userId);
    if (userIx == -1) list.lastSeen.push({ userId, seen });
    else list.lastSeen[userIx].seen = seen;
  },
  toggleList: (state, { listId, done, seen, actor }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.items.forEach((item) => {
      if (item.done !== done) {
        if (!actor) {
          item.lastAction = seen;
          list.updatedAt = seen;
        }
        item.done = done;
      }
    });
  },
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
  reorderList: (state, { listId, from, to, seen, actor }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const draggedItem = list.items.splice(from, 1)[0];
    list.items.splice(to, 0, draggedItem);
    if (!actor) {
      list.items[from].lastAction = seen;
      list.items[to].lastAction = seen;
      list.updatedAt = seen;
    }
  },
};

export default {
  getters,
  actions,
  mutations,
};
