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

  async sawList({ commit }, listId) {
    List.sawList(listId).then(res => {
      commit("sawList", res);
      return res;
    });
  },

  async listInvites({ commit }) {
    return Share.listInvites().then(res => res);
  },

  async approveInvites({ commit }, { approves, lists }) {
    return Share.approveInvites(approves).then(res => {
      commit("approveInvites", { lists });
      return res;
    });
  },

  async inviteList({ commit }, { listId, email, role }) {
    return Share.invite(listId, email, role).then(res => res);
  },

  async verifyInvitation({ commit }, token) {
    return Share.verifyInvitation(token).then(res => res);
  },

  /* list */
  async deleteList({ commit }, listId) {
    return List.delete(listId).then(res => {
      commit("removeList", listId);
      return res;
    });
  },

  async updateList({ commit }, data) {
    List.update(data).then(res => {
      commit("updateList", res.data);
      return true;
    });
  },

  async resetList({ commit }, listId) {
    List.reset(listId).then(res => {
      commit("resetList", listId);
      return true;
    });
  },

  async addList({ commit }, { list }) {
    List.create(list).then(res => {
      commit("addList", res.data);
      return res;
    });
  },

  async fetchLists({ commit }) {
    List.list().then(res => {
      if (res && res.data) {
        commit("setLists", res.data);
      }
      return res;
    });
  },

  // ITEMS

  async addItem({ commit }, { listId, item }) {
    return Item.create(listId, item).then(res => {
      commit("addItem", { listId, item: res.data });
      return res;
    });
  },

  async updateItem({ commit }, { listId, itemId, item }) {
    Item.update(listId, itemId, item).then(res => {
      commit("updateItem", { listId, item: res.data });
      return true;
    });
  },

  async deleteItem({ commit }, { listId, itemId }) {
    return Item.delete(listId, itemId).then(res => {
      commit("removeItem", { listId, itemId });
      return res;
    });
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
