import Api from "@/services/Api";
import REST from "@/services/RESTService";
class User extends REST {
  async register(creds) {
    console.log(creds);
    let url = `${this.root}/register`;
    return await Api().post(url, creds);
  }
  async verifyRegistration(token) {
    let url = `${this.root}/verifyRegistration/${token}`;
    return await Api().get(url);
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
