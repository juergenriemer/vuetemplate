import Api from "@/services/Api";

const root = "/item";

const getters = {};
const actions = {
  async addItem({ commit }, { listId, item, socket }) {
    commit("addItem", { listId, item });
    if (!socket)
      return Api()
        .post(`/item/${listId}`, item)
        .then(res => {
          // second update for the ID of the item
          commit("updateItem", {
            listId,
            itemId: item._id,
            item: res.data.item
          });
          return res;
        });
  },

  async updateItem({ commit }, { listId, itemId, item, socket }) {
    commit("updateItem", { listId, itemId, item });
    if (!socket) return Api().put(`/item/${listId}/${itemId}`, item);
  },

  async removeItem({ commit }, { listId, itemId, socket }) {
    commit("removeItem", { listId, itemId });
    if (!socket) Api().delete(`${root}/${listId}/${itemId}`);
  }
};

const mutations = {
  addItem: (state, { listId, item }) => {
    const list = state.lists.find(lst => lst._id == listId);
    list.items.push(item);
    /* update list lastSeen!!!  with item updatedAt? */
  },
  updateItem: (state, { listId, itemId, item }) => {
    const list = state.lists.find(lst => lst._id == listId);
    const itemIx = list.items.findIndex(itm => itm._id == itemId);
    Object.assign(list.items[itemIx], item);
  },
  removeItem: (state, { listId, itemId }) => {
    const list = state.lists.find(lst => lst._id == listId);
    list.items = list.items.filter(itm => itm._id != itemId);
  }
};

export default {
  //  state,
  //  getters,
  actions,
  mutations
};
