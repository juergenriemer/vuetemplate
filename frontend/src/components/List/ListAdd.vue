<template>
  <form id="list-add" @submit.prevent="add">
    <input
      type="text"
      name="title"
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
      await this.addList({
        list: this.list,
      });
      this.list.title = "";
    },
  },
};
</script>

<style>
#list-add {
  height: 60px;
  background: #e0e0e0;
  border-bottom: 1px solid #c0c0c0;
  border-right: 1px solid #c0c0c0;
}
#list-add input {
  font-size: 1.3em;
  background: #fff;
  width: calc(100% - 40px);
  margin: 10px;
  padding: 10px;
  border: 0;
}
#list-add input:focus {
  outline: none;
}
</style>
