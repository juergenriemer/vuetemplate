import router from "@/router";
import list from "@/store/modules/list/list";
import item from "@/store/modules/list/item";
import share from "@/store/modules/list/share";
//import comment from "@/store/modules/list/comment";

//var members = {};
const state = {
  lists: [],
};

const getters = {
  lists: (state) => {
    return state.lists;
  },
  listById: (state) => (listId) => {
    return state.lists.find((list) => list._id == listId) || [];
  },
  userById: (state, getters) => (listId, userId) => {
    return getters.listById(listId).users.find((usr) => usr.userId == userId);
  },
  // create new store!!!
  members: (state) => {
    let members = {};
    if (state.lists)
      state.lists.forEach((lst) => {
        lst.users.forEach((usr) => (members[usr.userId] = usr));
      });
    return members;
  },
  getMember: (state) => (memberId) => {
    let members = {};
    if (state.lists)
      state.lists.forEach((lst) => {
        return lst.users.forEach((usr) => (members[usr.userId] = usr));
      });
    return members[memberId];
  },
  isAdmin: (state, getters) => (listId, userId) => {
    const user = getters
      .listById(listId)
      .users.find((usr) => usr.userId == userId);
    return user.role == "admin" || user.role == "owner";
  },
};
const actions = {
  ...list.actions,
  ...item.actions,
  ...share.actions,
  //  ...comment.actions,
};

const mutations = {
  ...list.mutations,
  ...item.mutations,
  ...share.mutations,
  //  ...comment.mutations
};

export default {
  state,
  getters,
  actions,
  mutations,
};
