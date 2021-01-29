import { mapActions } from "vuex";

export default {
  name: "ItemAdd",
  data() {
    return {
      item: { title: "" }
    };
  },
  computed: {
    listId() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions(["addItem"]),
    async add() {
      const params = {
        listId: this.listId,
        item: this.item
      };
      await this.addItem(params);
      this.item.title = "";
    }
  }
};
