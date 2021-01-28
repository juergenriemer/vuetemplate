import Api from "@/services/Api";
class Item {
  constructor() {
    this.root = `/list/`;
  }
  list(idList) {
    return Api().get(`${this.root}/${idList}`);
  }

  create(idList, params) {
    return Api().post(`${this.root}/${idList}`, params);
  }

  update(idList, idItem, params) {
    console.log(params);
    return Api().put(`${this.root}/${idList}/${idItem}`, params);
  }

  delete(idList, idItem) {
    return Api().delete(`${this.root}/${idList}/${idItem}`);
  }
}
export default new Item("Item");
