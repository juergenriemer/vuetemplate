<template>
  <ion-list>
    <ion-reorder-group
      @ionItemReorder="reorder($event)"
      :disabled="!reorderMode"
    >
      <items-list-item
        @edit-item="editItem"
        @delete-item="deleteItem"
        @update-item="updateItem"
        @comment-mode="commentMode"
        v-for="item in items"
        :key="item._id"
        :item="item"
        :reorderMode="reorderMode"
      ></items-list-item>
    </ion-reorder-group>
  </ion-list>
</template>

<script>
import { IonList, IonReorderGroup } from "@ionic/vue";
import ItemsListItem from "./ItemsListItem.vue";

export default {
  emits: [
    "reorder-list",
    "delete-item",
    "update-item",
    "edit-item",
    "comment-mode",
  ],
  props: ["items", "reorderMode"],
  components: {
    IonList,
    IonReorderGroup,
    ItemsListItem,
  },
  methods: {
    reorder(evt) {
      const { from, to } = evt.detail;
      this.$emit("reorder-list", { from, to });
      evt.detail.complete();
    },
    deleteItem(itemId) {
      this.$emit("delete-item", itemId);
    },
    updateItem(item) {
      this.$emit("update-item", item);
    },
    editItem(item) {
      this.$emit("edit-item", item);
    },
    commentMode(item) {
      this.$emit("comment-mode", item);
    },
  },
};
</script>
