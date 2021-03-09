import Api from "@/services/Api";

class Comment {
  constructor() {
    this.root = `/comment`;
  }
  create(listId, itemId, comment) {
    return Api().post(`${this.root}/${listId}/${itemId}`, comment);
  }

  update(listId, itemId, comment) {
    return Api().put(`${this.root}/${listId}/${itemId}`, comment);
  }

  delete(listId, itemId, commentId) {
    return Api().delete(`${this.root}/${listId}/${itemId}/${commentId}`);
  }
}
export default new Comment("Comment");
