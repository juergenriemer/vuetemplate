<template>
  <form id="item-add" @submit.prevent="add">
    <input
      type="text"
      name="title"
      @blur="delayedAdd"
      placeholder="A NEW ITEM"
      v-model="item.title"
    />
    <i class="fas fa-times clear" @click="clear()" />
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
    clear() {
      this.item.title = "";
    },
    delayedAdd() {
      setTimeout(() => {
        this.add();
      }, 250);
    },
    async add() {
      console.log(this.item.title);
      if (!this.item.title) return;
      const params = {
        listId: this.listId,
        item: this.item,
      };
      this.addItem(params)
        .then(() => {
          this.item.title = "";
          this.$el.querySelector("input").focus();
        })
        .catch((err) => {
          this.showError(err);
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
