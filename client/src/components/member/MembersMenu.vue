<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="toggle-admin">Toggle Admin</ion-item>
    <ion-item button="true" data="unshare">Remove User</ion-item>
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
