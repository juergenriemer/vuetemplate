import axios from "axios";
import Api from "@/services/Api";
var readCookie = name => {
  let cookies = document.cookie;
  let c = cookies.split(name + "=")[1];
  console.log(">>>>>>>>>>>>>", c);
  return c;
};
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
    //    return Api().post(`http://192.168.1.27:3003/form`);
    return Api().put(`${this.root}/sawList/${listId}`);
  }

  create(params) {
    axios.defaults.headers.common["x-csrf-token"] = readCookie("_csrf");
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

var test = async function() {
  fetch(`http://192.168.1.27:3003/form`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    mode: "cors"
  })
    .then(res => {
      //console.log(res.text());
      return res.json();
    })
    .then(res => {
      return fetch(`http://192.168.1.27:3003/form`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "xsrf-token": res.csrf
        },
        credentials: "include",
        mode: "cors"
      });
    })
    .then(res => {
      console.log(res);
      //console.log(res.text());
      return res.json();
    })
    .then(res => {
      console.log(res);
    });
  /*
  let parsedResponse = fetchGetResponse.json();
  console.log(parsedResponse);
  csrfTokenState = parsedResponse;
  let fetchPostResponse = await fetch(`/form`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "xsrf-token": csrfTokenState
    },
    credentials: "include",
    mode: "cors"
  });
  console.log("<<<<<<<<<<<<<<< " + localStorage.getItem("csrf"));
  let parsedResponse2 = await fetchPostResponse.text();
  console.log(parsedResponse2);
*/
};
test();
export default new List("List");
