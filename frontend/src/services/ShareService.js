import Api from "@/services/Api";
class Share {
  root = `/share`;

  listInvites() {
    return Api().get(`${this.root}/listInvites`);
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
}
export default new Share();
