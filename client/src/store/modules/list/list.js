import Api from "@/services/Api.js";
const wire = Api.wire;
const http = Api.http;

const root = "/list";

const getters = {};

const actions = {
  async rawLists({ commit }) {
    return http()
      .get(`${root}`)
      .then((res) => {
        return res;
        //const server = [...res.data.lists];
      });
  },
  async synchronize({ commit, rootState }, { localLists }) {
    return http()
      .get(`${root}`)
      .then((res) => {
        let actions = [];
        //window.tzo
        const offlineSince = localStorage.getItem("offline-since");
        const server = [...res.data.lists];
        let local = [...rootState.list.lists];
        //local.forEach((lst) => console.log(lst.title, lst._id));
        //server.forEach((lst) => console.log(lst.title, lst._id));
        const lstNew = local.filter((lst) => /^id/.test(lst._id));
        local = local.filter((lst) => !/^id/.test(lst._id));
        lstNew.forEach((list) =>
          actions.push({
            type: "add-list",
            list,
          })
        );
        local.forEach((lst) => {
          let itmNew = lst.items.filter((itm) => /^id/.test(itm._id));
          if (itmNew.length) {
            lst.items = lst.items.filter((itm) => !/^id/.test(itm._id));
            itmNew.forEach((item) =>
              // check if list still exists on server
              // report.push( list no longer exists )
              actions.push({ type: "add-item", listId: lst._id, item })
            );
          }
          lst.items.forEach((itm) => {
            let cmtNew = itm.comments.filter((cmt) => /^id/.test(cmt._id));
            if (cmtNew.length) {
              cmtNew.forEach((comment) => {
                // check if list and/or item still exists on server
                actions.push({
                  type: "add-comment",
                  listId: lst._id,
                  itemId: itm._id,
                  comment,
                });
              });
            }
          });
        });
        const localIds = local.map((lst) => lst._id);
        console.log(offlineSince);
        const lstDel = server.filter(
          (lst) =>
            new Date(lst.updatedAt) < new Date(offlineSince) &&
            !localIds.includes(lst._id)
        );
        console.log("del", lstDel);
        console.log("actions", actions);
        return res;
      });
  },

  async addList({ commit, rootState }, { list }) {
    if (wire(arguments))
      return http()
        .post(`${root}`, list)
        .then((res) => {
          commit("addList", { list: res.data.list });
          return res;
        });
    list.offline = true;
    commit("addList", { list });
  },

  async updateList({ commit }, { listId, list }) {
    if (wire(arguments))
      return http()
        .put(`/list/${listId}`, list)
        .then((res) => {
          commit("updateList", { listId, list });
          return res;
        });
    list.offline = true;
    commit("updateList", { listId, list });
  },

  async deleteList({ commit }, { listId }) {
    if (wire(arguments))
      return http()
        .delete(`${root}/${listId}`)
        .then((res) => {
          commit("deleteList", { listId });
          return res;
        });
    else commit("deleteList", { listId });
  },

  async fetchLists({ commit }) {
    if (wire(arguments))
      return http()
        .get(`${root}`)
        .then((res) => {
          commit("fetchLists", { lists: res.data.lists });
          return res;
        });
  },

  async sawList({ commit }, { listId, userId }) {
    commit("sawList", { listId, userId });
    if (wire(arguments)) return http().put(`${root}/sawList/${listId}`);
  },

  async toggleList({ commit }, { listId, done }) {
    commit("toggleList", { listId, done });
    if (wire(arguments)) return http().put(`${root}/toggle/${listId}/${done}`);
  },

  async toggleAdmin({ commit }, { listId, userId, isAdmin }) {
    commit("toggleAdmin", { listId, userId, isAdmin });
    if (!self.isLocal)
      return http().put(`${root}/toggleAdmin/${listId}/${userId}/${isAdmin}`);
  },

  async reorderList({ commit }, { listId, from, to }) {
    commit("reorderList", { listId, from, to });
    if (wire(arguments))
      return http().put(`${root}/reorder/${listId}/${from}/${to}`);
  },
};

const mutations = {
  clearLists: (state) => (state.lists = []),
  synchronize: (state, { lists }) => {
    //console.log("server", lists);
    //console.log("local", state.lists);
  },
  fetchLists: (state, { lists }) => (state.lists = lists),
  addList: (state, { list }) => {
    state.lists.unshift(list);
  },
  updateList: (state, { listId, list }) => {
    const listIx = state.lists.findIndex((lst) => lst._id == listId);
    Object.assign(state.lists[listIx], list);
  },
  deleteList: (state, { listId }) =>
    (state.lists = state.lists.filter((lst) => lst._id !== listId)),
  sawList: (state, { listId, userId }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.lastSeen = new Date();
  },
  toggleList: (state, { listId, done }) => {
    const list = state.lists.find((list) => list._id == listId);
    list.items.forEach((item) => (item.done = done));
  },
  toggleAdmin: (state, { listId, userId, isAdmin }) => {
    const list = state.lists.find((list) => list._id == listId);
    let user = list.users.find((usr) => usr.userId == userId);
    user.role = isAdmin ? "admin" : "user";
  },
  reorderList: (state, { listId, from, to }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const draggedItem = list.items.splice(from, 1)[0];
    list.items.splice(to, 0, draggedItem);
  },
};

export default {
  getters,
  actions,
  mutations,
};
