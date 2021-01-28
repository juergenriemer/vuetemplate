import { mapActions } from "vuex";

export default {
  name: "ListAdd",
  data() {
    return {
      model: { title: "" }
    };
  },
  methods: {
    ...mapActions(["addList"]),
    add() {
      this.addList(this.model);
      this.model.title = "";
    }
  }
};
