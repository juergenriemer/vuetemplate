import List from "@/services/ListService";
import Item from "@/services/ItemService";
import Share from "@/services/ShareService";
import list from "@/store/modules/list/list";
import item from "@/store/modules/list/item";
import share from "@/store/modules/list/share";
import comment from "@/store/modules/list/comment";
import Vue from "vue";

const state = {
  lists: []
};

const getters = {
  lists: state => {
    return state.lists;
  },
  listById: state => listId => {
    return state.lists.find(list => list._id == listId);
  },
  userById: (state, getters) => (listId, userId) => {
    return getters.listById(listId).users.find(usr => usr.userId == userId);
  }
};
const actions = {
  ...list.actions,
  ...item.actions,
  ...comment.actions,
  ...share.actions,
  async xxxlistInvites({ commit }) {
    return Share.listInvites().then(res => res);
  },

  async xxxapproveInvites({ commit }, { approves, lists }) {
    return Share.approveInvites(approves).then(res => {
      commit("approveInvites", { lists });
      return res;
    });
  },

  async xxxinviteList({ commit }, { listId, email, role }) {
    return Share.invite(listId, email, role).then(res => res);
  },

  async verifyInvitation({ commit }, token) {
    return Share.verifyInvitation(token).then(res => res);
  }

  // ITEMS
};

const mutations = {
  ...list.mutations,
  ...item.mutations,
  ...share.mutations,
  ...comment.mutations
};

export default {
  state,
  getters,
  actions,
  mutations
};
