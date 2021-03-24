<template>
  <ion-list>
    <items-list-item
      @delete-item="deleteItem"
      @update-item="updateItem"
      v-for="item in items"
      :key="item._id"
      :item="item"
    ></items-list-item>
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import ItemsListItem from "./ItemsListItem.vue";

export default {
  props: ["items"],
  components: {
    IonList,
    ItemsListItem,
  },
  methods: {
    deleteItem(itemId) {
      this.$emit("delete-item", itemId);
    },
    updateItem(item) {
      this.$emit("update-item", item);
    },
  },
};
</script>
