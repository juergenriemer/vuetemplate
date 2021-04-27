import router from "@/router";
import list from "@/store/modules/list/list";
import item from "@/store/modules/list/item";
import share from "@/store/modules/list/share";
import comment from "@/store/modules/list/comment";
import file from "@/store/modules/list/file";

window.storeAction = (method, params, title) => {
  if (window.networkStatus == "online") return;
  if (window.appConnectionMode == "offline") return;
  if (/^delete/.test(method)) {
    for (var id in params) {
      if (/^id/.test(params[id])) return;
    }
  }
  console.log("STOOOORE ACTIN");
  let sOD = localStorage.getItem("sOD");
  let store = sOD ? JSON.parse(sOD) : [];
  store.push({
    order: 8,
    title,
    method,
    params,
  });
  localStorage.setItem("sOD", JSON.stringify(store));
};
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
  /* replace above */
  list: (state) => (listId) => {
    return state.lists.find((list) => list._id == listId) || [];
  },
  item: (state) => (listId, itemId) => {
    const list = state.lists.find((list) => list._id == listId);
    const item = list.items.find((itm) => itm._id == itemId);
    return item;
  },
  userById: (state, getters) => (listId, userId) => {
    return getters.listById(listId).users.find((usr) => usr.userId == userId);
  },
  // create new store!!!
  members: (state, getters, rootState) => {
    let members = {};
    const owner = rootState.user.user;
    members[owner.userId] = owner;
    if (state.lists)
      state.lists.forEach((lst) => {
        lst.users.forEach((usr) => (members[usr.userId] = usr));
      });
    else members[memberId] = state.user;
    return members;
  },
  getMember: (state, getters, rootState) => (memberId) => {
    let members = {};
    const owner = rootState.user.user;
    members[owner.userId] = owner;
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
  ...comment.actions,
  ...file.actions,
};

const mutations = {
  ...list.mutations,
  ...item.mutations,
  ...share.mutations,
  ...comment.mutations,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
