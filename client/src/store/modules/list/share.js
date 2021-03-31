import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

const root = "/share";

const getters = {};

const actions = {
  async invite({ commit }, { listId, email, role }) {
    return http()
      .get(`${root}/invite/${listId}/${email}/${role}`)
      .then((res) => {
        commit("invite", { listId, invitee: res.data.invitee });
        return res;
      });
  },

  async approveInvites({ commit }, { approves, lists }) {
    return http()
      .post(`${root}/approveInvitations`, approves)
      .then((res) => {
        commit("approveInvites", { lists });
        return res;
      });
  },

  async myInvites({ commit }) {
    return http().get(`${root}/myInvites`);
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    if (wire(arguments))
      return http().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  },

  async uninvite({ commit }, { listId, email }) {
    if (!wire(arguments)) commit("uninvite", { listId, email });
    else
      return http()
        .delete(`${root}/uninvite/${listId}/${email}`)
        .then((res) => {
          commit("uninvite", { listId, email });
          return res;
        });
  },

  async unshare({ commit, getters }, { listId, userId }) {
    if (!wire(arguments)) commit("unshare", { listId, userId });
    else
      return http()
        .delete(`${root}/unshare/${listId}/${userId}`)
        .then((res) => {
          commit("unshare", { listId, userId });
          return res;
        });
    // in case its the user that got unshared remove the list
    // DIDNT TEST THIS IN NEW ENV
    if (userId == getters.userId) {
      commit("deleteList", { listId });
      if (new RegExp(listId).test(self.location.hash))
        self.location.hash = "/main";
      state.lists = state.lists.filter((lst) => lst._id != listId);
    }
  },
};

const mutations = {
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
  approveInvites: (state, { lists }) => {
    state.lists.push(lists);
  },
  invite: (state, { listId, invitee }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.invitees.push(invitee);
  },
  unshare: (state, { listId, userId }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.users = list.users.filter((usr) => usr.userId != userId);
  },
  uninvite: (state, { listId, email }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.invitees = list.invitees.filter((usr) => usr.email != email);
  },
};

export default {
  getters,
  actions,
  mutations,
};
