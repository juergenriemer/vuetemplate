<template lang="pug">
.comments(v-if="comments")
  comments-list-item(
    @delete-item="deleteItem",
    v-for="comment in comments",
    :key="comment._id",
    :listId="listId",
    :item="item",
    :comment="comment"
  )
</template>

<script>
import { IonList, IonReorderGroup } from "@ionic/vue";
import CommentsListItem from "./CommentsListItem.vue";

export default {
  emits: ["delete-item"],
  props: ["listId", "item", "comments"],
  components: {
    IonList,
    CommentsListItem,
  },
  mounted() {},
  updated() {},
  methods: {
    deleteItem() {},
  },
};
</script>
