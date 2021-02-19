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
      item: { title: "", done: false },
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
      this.addItem(params)
        .then(() => {
          this.item.title = "";
        })
        .catch((err) => {
          this.error(err);
        });
    },
  },
};
</script>

<style>
#item-add {
  height: 60px;
  background: #e0e0e0;
  border-top: 1px solid #c0c0c0;
}

#item-add input {
  font-size: 1.3em;
  background: #fff;
  width: calc(100% - 40px);
  margin: 10px;
  padding: 10px;
  border: 0;
}

#item-add input:focus {
  outline: none;
}

#item-add button {
  display: none;
}
</style>
