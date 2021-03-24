<template>
  <ion-list>
    <item
      @delete-item="deleteItem"
      @update-item="updateItem"
      v-for="item in items"
      :key="item._id"
      :item="item"
    ></item>
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import Item from "./MembersListItem.vue";

export default {
  props: ["items"],
  components: {
    IonList,
    Item,
  },
  methods: {
    deleteItem(itemId) {
      this.$emit("delete", itemId);
    },
    updateItem(item) {
      this.$emit("update", item);
    },
  },
};
</script>
