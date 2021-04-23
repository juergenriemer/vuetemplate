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
          commit("addItem", { listId, item });
          return res;
        });
    item.offline = true;
    commit("addItem", { listId, item });
  },

  async updateItem({ commit }, { listId, itemId, item }) {
    if (wire(arguments))
      return http()
        .put(`${root}/${listId}/${itemId}`, item)
        .then((res) => {
          commit("updateItem", { listId, itemId, item });
          return res;
        });
    item.offline = true;
    commit("updateItem", { listId, itemId, item });
  },

  async deleteItem({ commit }, { listId, itemId }) {
    commit("deleteItem", { listId, itemId });
    if (wire(arguments)) return http().delete(`${root}/${listId}/${itemId}`);
  },
};

const mutations = {
  addItem: (state, { listId, item }) => {
    console.log(item);
    const list = state.lists.find((lst) => lst._id == listId);
    list.items.push(item);
    /* update list lastSeen!!!  with item updatedAt? */
  },
  updateItem: (state, { listId, itemId, item }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const itemIx = list.items.findIndex((itm) => itm._id == itemId);
    Object.assign(list.items[itemIx], item);
  },
  deleteItem: (state, { listId, itemId }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    list.items = list.items.filter((itm) => itm._id != itemId);
  },
};

export default {
  //  state,
  //  getters,
  actions,
  mutations,
};
