<template>
  <ion-list>
    <lists-list-item
      v-for="list in lists"
      :key="list._id"
      :list="list"
    ></lists-list-item>
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import ListsListItem from "./ListsListItem.vue";

export default {
  props: ["lists"],
  components: {
    IonList,
    ListsListItem,
  },
};
</script>
