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
          const comment = res.data.comment;
          commit("addComment", { listId, itemId, comment });
          return res;
        });
    comment.offline = true;
    commit("addComment", { listId, itemId, comment });
  },

  async deleteComment({ commit }, { listId, itemId, commentId }) {
    if (wire(arguments))
      return http()
        .delete(`${root}/${listId}/${itemId}/${commentId}`)
        .then(() => {
          commit("deleteComment", { listId, itemId, commentId });
        });
    window.storeAction(
      "deleteComment",
      { listId, itemId, commentId },
      "delete comment " + commentId
    );
    commit("deleteComment", { listId, itemId, commentId });
  },
};

const mutations = {
  addComment: (state, { listId, itemId, comment }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    item.comments.push(comment);
  },

  deleteComment: (state, { listId, itemId, commentId }) => {
    const list = state.lists.find((list) => list._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    item.comments = item.comments.filter((comment) => comment._id != commentId);
  },
  updateComment: (state, { listId, itemId, commentId, comment }) => {
    const list = state.lists.find((lst) => lst._id == listId);
    const item = list.items.find((item) => item._id == itemId);
    const commentIx = item.comments.findIndex((cmt) => cmt._id == commentId);
    Object.assign(item.comments[commentIx], comment);
  },
};

export default {
  //  state,
  //  getters,
  actions,
  mutations,
};
