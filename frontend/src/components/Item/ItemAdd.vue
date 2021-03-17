<template lang="pug">
form#item-add(@submit.prevent="add")
  input(
    type="text",
    name="title",
    @blur="delayedAdd",
    placeholder="ADD NEW ITEM",
    v-model="item.title"
  )
  i.fas.fa-times.clear(@click="clear()")
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ItemAdd",
  data() {
    return {
      item: { title: "", done: false, comments: [] },
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
      if (!this.item.title) return;
      let item = Object.assign(
        { _id: this.objectId(), comments: [] },
        this.item
      );
      this.addItem({
        listId: this.listId,
        item,
      })
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
