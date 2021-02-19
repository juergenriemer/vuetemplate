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
    console.log(data);
    return Api().post(`${this.root}/resetPassword`, data);
  }

  resetPasswordVerify(token) {
    return Api().get(`${this.root}/resetPasswordVerify/${token}`);
  }

  /* refactor below */
  async register(creds) {
    let url = `${this.root}/register`;
    return await Api().post(url, creds);
  }
  async login(creds) {
    let url = `${this.root}/login`;
    return await Api().post(url, creds);
  }
  async info() {
    let url = `${this.root}/info`;
    return await Api().get(url);
  }
  async logout(creds) {
    let url = `${this.root}/logout`;
    return await Api().post(url, creds);
  }
}
export default new User("User");
