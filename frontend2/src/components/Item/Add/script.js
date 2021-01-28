import { mapActions } from "vuex";

export default {
  name: "ItemAdd",
  data() {
    return {
      model: { title: "" }
    };
  },
  computed: {
    idList() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions(["addItem"]),
    async add() {
      await this.addItem({
        idList: this.idList,
        data: this.model
      });
      this.model.title = "";
    }
  }
};
