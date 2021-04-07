<template lang="pug">
.comments(v-if="items.length")
  comments-list-item(
    @delete-item="deleteItem",
    v-for="item in items",
    :key="item._id",
    :item="item"
  )
</template>

<script>
import { IonList, IonReorderGroup } from "@ionic/vue";
import CommentsListItem from "./CommentsListItem.vue";

export default {
  emits: ["delete-item"],
  props: ["items"],
  data() {
    return {
      userId: 123,
    };
  },
  components: {
    IonList,
    CommentsListItem,
  },
  methods: {
    deleteItem(itemId) {
      this.$emit("delete-comment", itemId);
    },
  },
};
</script>
