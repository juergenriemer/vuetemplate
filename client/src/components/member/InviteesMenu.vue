<template>
  <ion-list @click="action($event)">
    <ion-item data="delete">Remove User</ion-item>
  </ion-list>
</template>
<script>
import { IonList, IonItem } from "@ionic/vue";

export default {
  props: ["action"],
  components: {
    IonList,
    IonItem,
  },
};
</script>
