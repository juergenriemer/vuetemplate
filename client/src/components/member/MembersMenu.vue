<template>
  <ion-list @click="action($event)">
    <ion-item data="edit">Make Admin</ion-item>
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
  methods: {},
};
</script>
