import Api from "@/services/Api";
const wire = Api.wire;
const http = Api.http;

const root = "/file";

const getters = {};

const actions = {
  async upload({ commit }, { listId, itemId, formData }) {
    if (wire(arguments))
      return http()
        .post(`${root}/${listId}/${itemId}`, formData)
        .then((res) => {
          return res;
        });
  },
  async download({ commit }, { imageFile }) {
    if (wire(arguments))
      return http()
        .get(`${root}/${imageFile}`)
        .then((res) => {
          return res;
        });
  },
};

const mutations = {};

export default {
  //  state,
  //  getters,
  actions,
  //mutations,
};
