<template>
  <ion-list @click="action($event)">
    <ion-item data="reseet">Uncheck all Items</ion-item>
    <ion-item data="move">Reorder Items</ion-item>
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
