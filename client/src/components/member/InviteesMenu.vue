<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="uninvite">Withdraw Invitation</ion-item>
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
