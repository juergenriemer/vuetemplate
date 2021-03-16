import Api from "@/services/Api";

const root = "/comment";

const getters = {};
const actions = {
  async addComment({ commit }, { listId, itemId, comment, socket }) {
    commit("addComment", { listId, itemId, comment });
    if (!socket)
      return Api()
        .post(`${root}/${listId}/${itemId}`, comment)
        .then(res => {
          // second update for the ID of the item
          commit("updateComment", {
            listId,
            itemId: itemId,
            commentId: comment._id,
            comment: res.data.comment
          });
          return res;
        });
  },

  async addItem({ commit }, { listId, item, socket }) {
    commit("addItem", { listId, item });
    if (!socket)
      return Api()
        .post(`/item/${listId}`, item)
        .then(res => {
          // second update for the ID of the item
          commit("updateItem", {
            listId,
            itemId: item._id,
            item: res.data.item
          });
          return res;
        });
  },

  async removeComment({ commit }, { listId, itemId, commentId, socket }) {
    commit("removeComment", { listId, itemId, commentId });
    if (!socket)
      return Api().delete(`${root}/${listId}/${itemId}/${commentId}`);
  }
};

const mutations = {
  addComment: (state, { listId, itemId, comment }) => {
    const list = state.lists.find(lst => lst._id == listId);
    const item = list.items.find(item => item._id == itemId);
    item.comments.push(comment);
  },

  removeComment: (state, { listId, itemId, commentId }) => {
    const list = state.lists.find(list => list._id == listId);
    const item = list.items.find(item => item._id == itemId);
    item.comments = item.comments.filter(comment => comment._id != commentId);
  },
  updateComment: (state, { listId, itemId, commentId, comment }) => {
    const list = state.lists.find(lst => lst._id == listId);
    const item = list.items.find(item => item._id == itemId);
    const commentIx = item.comments.findIndex(cmt => cmt._id == commentId);
    Object.assign(item.comments[commentIx], comment);
  }
};

export default {
  //  state,
  //  getters,
  actions,
  mutations
};
