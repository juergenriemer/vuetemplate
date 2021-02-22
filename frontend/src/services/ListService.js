import Api from "@/services/Api";
class List {
  constructor(name) {
    this.root = `/${name}`;
    this.name = name;
  }
  list() {
    return Api().get(`${this.root}/`);
  }

  approveInvites(listIds) {
    return Api().post(`${this.root}/approveInvitations`, listIds);
  }

  invite(listId, email, role) {
    return Api().get(`${this.root}/invite/${listId}/${email}/${role}`);
  }

  verifyInvitation(token) {
    return Api().get(`${this.root}/verifyInvitation/${token}`);
  }

  sawList(listId) {
    return Api().put(`${this.root}/sawList/${listId}`);
  }

  create(params) {
    return Api().post(this.root, params);
  }

  reset(listId) {
    return Api().put(`${this.root}/reset/${listId}`);
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
