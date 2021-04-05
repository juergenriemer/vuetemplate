<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="logout">Logout</ion-item>
    <ion-item button="true" data="approve-invites"
      >Approve Invitations</ion-item
    >
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
  computed: {},
};
</script>
