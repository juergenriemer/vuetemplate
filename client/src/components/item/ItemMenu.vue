<template>
  <ion-list @click="action($event)">
    <ion-item data='edit'>Edit item</ion-item>
    <ion-item data='comment'>Add comment</ion-item>
    <ion-item data='delete'>Delete item</ion-item>
  </ion-list>
</template>
<script>
import { IonList, IonItem } from "@ionic/vue";

export default {
  props: ["itemId", "action"],
  components: {
    IonList,
    IonItem,
  },
  methods: {},
};
</script>
