import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

const root = "/comment";

const getters = {};

const actions = {
  async addComment({ commit }, { listId, itemId, comment }) {
    if (wire(arguments))
      return http()
        .post(`${root}/${listId}/${itemId}`, comment)
        .then((res) => {
          commit("addComment", res.data);
          return res;
        });
    if (self.$$.network !== "online") comment.offline = true;
    commit("addComment", { listId, itemId, comment });
  },

  async deleteComment({ commit }, { listId, itemId, commentId, updatedAt }) {
    if (wire(arguments))
      return http()
        .delete(`${root}/${listId}/${itemId}/${commentId}`)
        .then((res) => {
          commit("deleteComment", res.data);
        });
    window.storeAction(
      arguments,
      "deleteComment",
      { listId, itemId, commentId },
      "delete comment " + commentId
    );
    commit("deleteComment", { listId, itemId, commentId, updatedAt });
  },

  async sawComments({ commit }, { listId, itemId, userId }) {
    if (wire(arguments))
      return http()
        .put(`${root}/saw/${listId}/${itemId}`)
        .then((res) => {
          commit("sawComments", res.data);
        });
    // we are offline no need?? commit("sawList", { listId, userId,  });
  },

  async sawComment({ commit }, { listId, itemId, commentId, userId, seen }) {
    commit("sawComment", { listId, itemId, userId, commentId, seen });
  },
};

const mutations = {
  addComment: (state, { listId, itemId, comment }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    item.comments.push(comment);
    item.updatedAt = comment.updatedAt;
    list.updatedAt = comment.updatedAt;
  },
  deleteComment: (state, { listId, itemId, commentId, updatedAt }) => {
    const list = state.lists.find((list) => list._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    item.comments = item.comments.filter((comment) => comment._id != commentId);
    item.updatedAt = updatedAt;
    list.updatedAt = updatedAt;
    //list.users.find( usr => usr.userId == lastSeen = updatedAt;
  },
  updateComment: (state, { listId, itemId, commentId, comment }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    const commentIx = item.comments.findIndex((cmt) => cmt._id == commentId);
    Object.assign(item.comments[commentIx], comment);
  },
  sawComments: (state, { listId, itemId, userId, seen }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((itm) => itm._id == itemId);
    item.comments.forEach((comment) => {
      let userIx = comment.lastSeen.findIndex((elem) => elem.userId == userId);
      if (userIx == -1) comment.lastSeen.push({ userId, seen });
      else comment.lastSeen[userIx].seen = seen;
    });
  },
  sawComment: (state, { listId, itemId, userId, commentId, seen }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((itm) => itm._id == itemId);
    const comment = item.comments.find((cmt) => cmt._id == commentId);
    let userIx = comment.lastSeen.findIndex((elem) => elem.userId == userId);
    if (userIx == -1) comment.lastSeen.push({ userId, seen });
    else comment.lastSeen[userIx].seen = seen;
  },
};

export default {
  //  state,
  //  getters,
  actions,
  mutations,
};
