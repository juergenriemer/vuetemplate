<template>
  <form id="list-add" @submit.prevent="add">
    <input
      type="text"
      name="title"
      @blur="add"
      placeholder="NEW LIST"
      v-model="list.title"
    />
  </form>
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
      this.addList({
        list: this.list,
      })
        .then(() => (this.list.title = ""))
        .catch((err) => this.showError(err));
    },
  },
};
</script>

<style>
#xxxxxxxxxxlist-add {
  height: 60px;
  background: #e0e0e0;
  border-bottom: 1px solid #c0c0c0;
  border-right: 1px solid #c0c0c0;
}
#list-add input {
  font-size: 1.3em;
  background: #fff;
  margin: 10px;
  padding: 10px;
  border: 0;
}
#list-add input:focus {
  outline: none;
}
</style>
