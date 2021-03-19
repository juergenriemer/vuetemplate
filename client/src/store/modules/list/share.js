import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

const root = "/share";

const getters = {};

const actions = {
  async invite({ commit }, { listId, email, role }) {
    commit("invite", { listId, email, role });
    return http().get(`${root}/invite/${listId}/${email}/${role}`);
  },

  async approveInvites({ commit }, { approves, lists }) {
    return http()
      .post(`${root}/approveInvitations`, approves)
      .then(res => {
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

  async unshare({ commit }, { listId, userId, socket }) {
    if (socket) commit("unshare", { listId, userId });
    else
      return http()
        .delete(`${root}/unshare/${listId}/${userId}`)
        .then(res => {
          commit("unshare", { listId, userId });
          return res;
        });
  }
};

const mutations = {
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find(list => list._id == listId);
    let user = list.users.find(usr => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
  approveInvites: (state, { lists }) => {
    console.log(lists);
    state.lists.push(lists);
  },
  invite: (state, { listId, email, role }) => {
    const list = state.lists.find(list => list._id == listId);
    list.invitees.push({ email, role });
  },
  unshare: (state, getters, { listId, userId }) => {
    const list = state.lists.find(list => list._id == listId);
    list.users = list.users.filter(usr => usr.userId != userId);
    // in case its the user that got unshared remove the list
    if (userId == getters.userId) {
      if (new RegExp(listId).test(self.location.hash))
        self.location.hash = "/main";
      state.lists = state.lists.filter(lst => lst._id != listId);
    }
  }
};

export default {
  getters,
  actions,
  mutations
};
