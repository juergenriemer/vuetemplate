import Api from "@/services/Api";

class Item {
  constructor() {
    this.root = `/item`;
  }
  list(listId) {
    return Api().get(`${this.root}/${listId}`);
  }

  create(listId, item) {
    return Api().post(`${this.root}/${listId}`, item);
  }

  update(listId, itemId, item) {
    return Api().put(`${this.root}/${listId}/${itemId}`, item);
  }

  delete(listId, itemId) {
    return Api().delete(`${this.root}/${listId}/${itemId}`);
  }
}
export default new Item("Item");
