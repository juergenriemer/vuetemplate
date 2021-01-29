import { mapActions } from "vuex";

export default {
  name: "ListAdd",
  data() {
    return {
      list: { title: "" }
    };
  },
  computed: {
    listId() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions(["addList"]),
    async add() {
      await this.addList({
        list: this.list
      });
      this.list.title = "";
    }
  }
};
