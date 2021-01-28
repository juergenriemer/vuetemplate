import List from "@/services/ListService";
import Item from "@/services/ItemService";
import Vue from "vue";
const state = {
  lists: []
};

const getters = {
  lists: state => {
    return state.lists;
  }
};

const actions = {
  async deleteList({ commit }, id) {
    const response = await List.delete(id);
    commit("removeList", id);
  },

  async updateList({ commit }, data) {
    const response = await List.update(data);
    commit("updateList", response.data);
    return true;
  },

  async addList({ commit }, data) {
    const response = await List.create(data);
    commit("addList", response.data);
  },

  async fetchLists({ commit }) {
    const res = await List.list();
    if (res && res.data) {
      commit("setLists", res.data);
    }
  },

  // ITEMS

  async deleteItem({ commit }, { idList, idItem }) {
    const res = await Item.delete(idList, idItem);
    commit("removeItem", { idList, idItem });
  },

  async updateItem({ commit }, { idList, idItem, data }) {
    const res = await Item.update(idList, idItem, data);

    commit("updateItem", res.data);
    return true;
  },

  async addItem({ commit }, { idList, data }) {
    const res = await Item.create(idList, data);
    let item = res.data;
    commit("addItem", { idList, item });
  },

  addItemExtern({ commit }, data) {
    commit("addItemExtern", data);
  },

  updateItemExtern({ commit }, data) {
    commit("updateItemExtern", data);
  },

  async removeItemExtern({ commit }, data) {
    commit("removeItemExtern", data);
  }
};

const mutations = {
  addList: (state, newList) => state.lists.unshift(newList),
  setLists: (state, lists) => (state.lists = lists),
  removeList: (state, idList) => {
    state.lists = state.lists.filter(list => list._id !== idList);
  },
  updateList: (state, item) => {
    const index = state.lists.findIndex(list => {
      return list._id == item._id;
    });
    if (index !== -1) {
      state.lists.splice(index, 1, item);
    }
  },
  updateItem: (state, data) => {
    const ix = state.lists.findIndex(itm => itm._id == data._id);
    if (ix !== -1) {
      state.lists.splice(ix, 1, data);
    }
  },
  addItem: (state, { idList, item }) => {
    let ixList = state.lists.findIndex(list => list._id == idList);
    let items = state.lists[ixList].items;
    items.push(item);
  },
  removeItem: (state, { idList, idItem }) => {
    let ixList = state.lists.findIndex(list => list._id == idList);
    let items = state.lists[ixList].items;
    items.splice(
      items.findIndex(item => item._id == idItem),
      1
    );
  },
  addItemExtern: (state, data) => {
    let listId = data.listId;
    let item = data.item;
    let list = state.lists.find(list => list._id == listId);
    list.items.push(item);
    if (!list.meta) {
      Vue.set(list, "meta", { added: 0, updated: 0, removed: 0 });
    }
    list.meta.updated++;
  },
  updateItemExtern: (state, updated) => {
    let list = state.lists.find(list => list._id == updated.listId);
    let itemIx = list.items.findIndex(item => item._id == updated.item._id);
    Object.assign(list.items[itemIx], updated.item);
    if (!list.meta) {
      Vue.set(list, "meta", { added: 0, updated: 0, removed: 0 });
    }
    list.meta.updated++;
  },
  removeItemExtern: (state, data) => {
    let listId = data.listId;
    let itemId = data.itemId;
    let list = state.lists.find(list => list._id == listId);
    list.items.splice(
      list.items.findIndex(item => item._id == itemId),
      1
    );
    if (!list.meta) {
      Vue.set(list, "meta", { added: 0, updated: 0, removed: 0 });
    }
    list.meta.removed++;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
