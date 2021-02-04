<template>
  <form id="item-add" @submit.prevent>
    <input
      type="text"
      name="title"
      placeholder="NEW ITEM"
      v-model="item.title"
    />
    <button type="submit" @click="add">ADD</button>
  </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ItemAdd",
  data() {
    return {
      item: { title: "" },
    };
  },
  computed: {
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions(["addItem"]),
    async add() {
      const params = {
        listId: this.listId,
        item: this.item,
      };
      await this.addItem(params);
      this.item.title = "";
    },
  },
};
</script>

<style>
#item-add {
  height: 60px;
  background: #f0f0f0;
  background: #e0e0e0;
  border-top: 1px dashed #c0c0c0;
}
#item-add input {
  margin: 10px;
  font-size: 1.3em;
  border: 0;
  padding: 5px;
  background: #fff;
}

#item-add button {
  display: none;
}
</style>
