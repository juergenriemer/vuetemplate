import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

const root = "/item";

const getters = {};

const actions = {
  async addItem({ commit }, { listId, item }) {
    if (wire(arguments))
      return http()
        .post(`${root}/${listId}`, item)
        .then((res) => {
          commit("addItem", res.data);
          return res;
        });
    if (self.$$.network !== "online") item.offline = true;
    commit("addItem", { listId, item });
  },

  async updateItem({ commit }, { listId, itemId, item }) {
    if (wire(arguments))
      return http()
        .put(`${root}/${listId}/${itemId}`, item)
        .then((res) => {
          commit("updateItem", res.data);
          return res;
        });
    if (self.$$.network !== "online") item.offline = true;
    commit("updateItem", { listId, itemId, item });
  },

  async deleteItem({ commit }, { listId, itemId, updatedAt }) {
    if (wire(arguments))
      return http()
        .delete(`${root}/${listId}/${itemId}`)
        .then((res) => {
          commit("deleteItem", res.data);
        });
    window.storeAction(
      arguments,
      "deleteItem",
      { listId, itemId },
      "delete item " + itemId
    );
    commit("deleteItem", { listId, itemId, updatedAt });
  },

  async sawItems({ commit }, { listId, userId }) {
    if (wire(arguments))
      return http()
        .put(`${root}/saw/${listId}`)
        .then((res) => {
          commit("sawItems", res.data);
        });
    // we are offline no need?? commit("sawList", { listId, userId,  });
  },

  async sawItem({ commit }, { listId, itemId, userId, seen }) {
    commit("sawItem", { listId, itemId, userId, seen });
  },
};

const mutations = {
  addItem: (state, { listId, item }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    list.items.push(item);
    list.updatedAt = new Date();
    // list.updatedAt = item.updatedAt;
    // list.lastSeen = item.updatedAt;
    /* update list lastSeen!!!  with item updatedAt? */
  },
  updateItem: (state, { listId, itemId, item }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const itemIx = list.items.findIndex((itm) => itm._id == itemId);
    Object.assign(list.items[itemIx], item);
    list.updatedAt = new Date();
  },
  deleteItem: (state, { listId, itemId }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    list.items = list.items.filter((itm) => itm._id != itemId);
  },
  sawItems: (state, { listId, userId, seen }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    list.items.forEach((item) => {
      let userIx = item.lastSeen.findIndex((elem) => elem.userId == userId);
      if (userIx == -1) item.lastSeen.push({ userId, seen });
      else item.lastSeen[userIx].seen = seen;
    });
  },
  sawItem: (state, { listId, itemId, userId, seen }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((itm) => itm._id == itemId);
    let userIx = item.lastSeen.findIndex((elem) => elem.userId == userId);
    if (userIx == -1) item.lastSeen.push({ userId, seen });
    else item.lastSeen[userIx].seen = seen;
  },
};

export default {
  //  state,
  //  getters,
  actions,
  mutations,
};
