import Api from "@/services/Api";
import Csrf from "@/services/CsrfService";

class Item {
  constructor() {
    this.root = `/item`;
  }
  list(listId) {
    return Api().get(`${this.root}/${listId}`);
  }

  create(listId, item) {
    return Csrf().then(() => {
      return Api().post(`${this.root}/${listId}`, item);
    });
  }

  update(listId, itemId, params) {
    return Csrf().then(() => {
      return Api().put(`${this.root}/${listId}/${itemId}`, params);
    });
  }

  delete(listId, itemId) {
    return Csrf().then(() => {
      return Api().delete(`${this.root}/${listId}/${itemId}`);
    });
  }
}
export default new Item("Item");
