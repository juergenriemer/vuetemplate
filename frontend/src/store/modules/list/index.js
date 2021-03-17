import list from "@/store/modules/list/list";
import item from "@/store/modules/list/item";
import share from "@/store/modules/list/share";
import comment from "@/store/modules/list/comment";

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
  ...share.actions
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
