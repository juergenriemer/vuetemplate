import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;
class User {
  constructor() {
    this.root = `/users`;
  }
  registerVerifyResend(email) {
    return http().post(`${this.root}/registerVerifyResend`, email);
  }
  registerVerify(token) {
    return http().get(`${this.root}/registerVerify/${token}`);
  }

  resetPassword(data) {
    return http().post(`${this.root}/resetPassword`, data);
  }

  resetPasswordVerify(token) {
    return http().get(`${this.root}/resetPasswordVerify/${token}`);
  }

  info() {
    return http().get(`${this.root}/info`);
  }
  login(creds) {
    return http().post(`${this.root}/login`, creds);
  }

  register(creds) {
    return http().post(`${this.root}/register`, creds);
  }
  logout() {
    return http().post(`${this.root}/logout`);
  }
}
export default new User("User");
