import Api from "@/services/Api";
class User {
  constructor() {
    this.root = `/users`;
  }
  registerVerifyResend(email) {
    return Api().post(`${this.root}/registerVerifyResend`, email);
  }
  registerVerify(token) {
    return Api().get(`${this.root}/registerVerify/${token}`);
  }

  resetPassword(data) {
    return Api().post(`${this.root}/resetPassword`, data);
  }

  resetPasswordVerify(token) {
    return Api().get(`${this.root}/resetPasswordVerify/${token}`);
  }

  info() {
    return Api().get(`${this.root}/info`);
  }
  login(creds) {
    return Api().post(`${this.root}/login`, creds);
  }

  register(creds) {
    return Api().post(`${this.root}/register`, creds);
  }
  logout() {
    return Api().post(`${this.root}/logout`);
  }
}
export default new User("User");
