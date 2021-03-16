<template lang="pug">
form#list-add(@submit.prevent="add")
  input(
    type="text",
    name="title",
    @blur="add",
    placeholder="ADD NEW LIST",
    v-model="list.title"
  )
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "ListAdd",
  data() {
    return {
      list: { title: "" },
    };
  },
  computed: {
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions(["addList"]),
    async add() {
      if (!this.list.title) return;
      let list = Object.assign(
        {
          _id: this.objectId(),
          users: [{ userId: this.myUserId, role: "owner" }],
          items: [],
        },
        this.list
      );
      this.addList({ list })
        .then(() => (this.list.title = ""))
        .catch((err) => this.showError(err));
    },
  },
};
</script>
