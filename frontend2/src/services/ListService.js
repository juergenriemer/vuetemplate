import Api from "@/services/Api";
class List {
  constructor(name) {
    this.root = `/${name}`;
    this.name = name;
  }
  list() {
    return Api().get(`${this.root}/`);
  }

  sawList(listId) {
    return Api().put(`${this.root}/sawList/${listId}`);
  }

  create(params) {
    return Api().post(this.root, params);
  }

  update(params) {
    let id = params.id || params._id;
    return Api().put(`${this.root}/${id}`, params);
  }

  delete(id) {
    return Api().delete(`${this.root}/${id}`);
  }
}
export default new List("List");
