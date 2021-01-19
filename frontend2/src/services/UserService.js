import Api from "@/services/Api";
import REST from "@/services/RESTService";
class User extends REST {
  async login(creds) {
    let url = `${this.root}/login`;
    return await Api().post(url, creds);
  }
  async info(username) {
    let url = `${this.root}/info`;
    return await Api().post(url, { username });
  }
  async logout(creds) {
    let url = `${this.root}/login`;
    return await Api().post(url, creds);
  }
}
export default new User("User");
