<template>
  <form id="list-add" @submit.prevent>
    <input
      type="text"
      name="title"
      placeholder="ADD LIST"
      v-model="list.title"
    />
    <button type="submit" @click="add">Add</button>
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
  background: #f0f0f0;
  background: #e0e0e0;
  border-top: 1px dashed #c0c0c0;
  border-right: 6px solid #c0c0c0;
}
#list-add input {
  margin: 10px;
  font-size: 1.3em;
  border: 0;
  padding: 5px;
  background: #fff;
}
</style>
