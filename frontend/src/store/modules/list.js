import List from "@/services/ListService";
import Item from "@/services/ItemService";
import Share from "@/services/ShareService";
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
  /* share */

  async listInvites({ commit }) {
    return Share.listInvites().then(res => res);
  },

  async approveInvites({ commit }, { approves, lists }) {
    const response = await Share.approveInvites(approves);
    commit("approveInvites", { lists });
  },

  async inviteList({ commit }, { listId, email, role }) {
    return Share.invite(listId, email, role);
  },

  async verifyInvitation({ commit }, token) {
    const res = await Share.verifyInvitation(token);
    return res;
  },

  /* list */
  async deleteList({ commit }, listId) {
    return List.delete(listId).then(res => {
      commit("removeList", listId);
      return res;
    });
  },

  async updateList({ commit }, data) {
    const response = await List.update(data);
    commit("updateList", response.data);
    return true;
  },

  async resetList({ commit }, listId) {
    const response = await List.reset(listId);
    commit("resetList", listId);
    return true;
  },

  async addList({ commit }, { list }) {
    const response = await List.create(list);
    commit("addList", response.data);
  },

  async fetchLists({ commit }) {
    const res = await List.list();
    if (res && res.data) {
      commit("setLists", res.data);
    }
  },

  // ITEMS

  async addItem({ commit }, { listId, item }) {
    return Item.create(listId, item).then(res => {
      commit("addItem", { listId, item: res.data });
      return res;
    });
  },

  async updateItem({ commit }, { listId, itemId, item }) {
    const res = await Item.update(listId, itemId, item);
    commit("updateItem", { listId, item: res.data });
    return true;
  },

  async deleteItem({ commit }, { listId, itemId }) {
    const res = await Item.delete(listId, itemId);
    commit("removeItem", { listId, itemId });
  },

  addItemExtern({ commit }, data) {
    commit("addItemExtern", data);
  },

  updateItemExtern({ commit }, data) {
    commit("updateItemExtern", data);
  },

  async removeItemExtern({ commit }, data) {
    commit("removeItemExtern", data);
  },

  async sawList({ commit }, data) {
    const res = await List.sawList(data);
    if (res) commit("sawList", res);
  }
};

const mutations = {
  sawList: (state, { data }) => {
    let userId = localStorage.getItem("userid");
    let list = state.lists.find(list => list._id == data.listId);
    if (list) {
      let user = list.users.find(user => user.userId == userId);
      user && (user.lastSeen = data.lastSeen);
    }
  },
  addList: (state, newList) => state.lists.unshift(newList),
  setLists: (state, lists) => (state.lists = lists),
  removeList: (state, listId) => {
    state.lists = state.lists.filter(list => list._id !== listId);
  },

  approveInvites: (state, { lists }) => {
    console.log("add lists!!");
  },
  updateList: (state, item) => {
    const index = state.lists.findIndex(list => {
      return list._id == item._id;
    });
    if (index !== -1) {
      state.lists.splice(index, 1, item);
    }
  },
  resetList: (state, listId) => {
    const list = state.lists.find(list => {
      return list._id == listId;
    });
    list.items.forEach(item => (item.done = false));
  },
  updateItem: (state, { listId, item }) => {
    let userId = localStorage.getItem("userid");
    let list = state.lists.find(list => list._id == listId);
    list.users.find(user => user.userId == userId).lastSeen = item.updatedAt;
    const ix = state.lists.findIndex(itm => itm._id == item._id);
    if (ix !== -1) {
      state.lists.splice(ix, 1, item);
    }
  },
  addItem: (state, { listId, item }) => {
    let userId = localStorage.getItem("userid");
    let list = state.lists.find(list => list._id == listId);
    list.users.find(user => user.userId == userId).lastSeen = item.updatedAt;
    let ixList = state.lists.findIndex(list => list._id == listId);
    let items = state.lists[ixList].items;
    items.push(item);
  },
  removeItem: (state, { listId, itemId }) => {
    let ixList = state.lists.findIndex(list => list._id == listId);
    let items = state.lists[ixList].items;
    items.splice(
      items.findIndex(item => item._id == itemId),
      1
    );
  },
  addItemExtern: (state, data) => {
    let { listId, item } = data;
    let list = state.lists.find(list => list._id == listId);
    list.items.push(item);
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
    let { listId, itemId } = data;
    let list = state.lists.find(list => list._id == listId);
    list.items.splice(
      list.items.findIndex(item => item._id == itemId),
      1
    );
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
