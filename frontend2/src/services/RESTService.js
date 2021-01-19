import Api from "@/services/Api";
class REST {
  constructor(model) {
    this.root = `/${model}s`;
    this.name = model;
  }

  list(query = {}, sort = {}, slice = {}, fields = []) {
    return Api().get(`${this.root}/`);
  }

  search(query = {}, sort = {}, slice = {}, fields = []) {
    let queryString = encodeURIComponent(JSON.stringify(query));
    let sortString = encodeURIComponent(JSON.stringify(sort));
    let sliceString = encodeURIComponent(JSON.stringify(slice));
    let fieldsString = encodeURIComponent(JSON.stringify(fields));
    return Api().get(
      `${this.root}/${queryString}/${sortString}/${sliceString}/${fieldsString}`
    );
  }

  create(params) {
    return Api().post(this.root, params);
  }

  update(params) {
    let id = params.id || params._id;
    return Api().put(`${this.root}/${id}`, params);
  }

  read(id) {
    return Api().get(`${this.root}/${id}`);
  }

  delete(id) {
    return Api().delete(`${this.root}/${id}`);
  }
}
export default REST;
