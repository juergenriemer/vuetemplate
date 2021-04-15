<template lang="pug">
.comments(v-if="items.length")
  comments-list-item(
    @delete-item="deleteItem",
    v-for="item in items",
    :key="item._id",
    :item="item",
    :itemId="itemId"
  )
</template>

<script>
import { IonList, IonReorderGroup } from "@ionic/vue";
import CommentsListItem from "./CommentsListItem.vue";

export default {
  emits: ["delete-item"],
  props: ["items", "itemId"],
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
