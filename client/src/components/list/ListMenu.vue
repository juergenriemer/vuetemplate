<template>
  <ion-list lines="none" @click="action">
    <ion-item button="true" data="info">List Info</ion-item>
    <ion-item button="true" data="members">Share List</ion-item>
    <ion-item button="true" data="edit">Edit List</ion-item>
    <ion-item button="true" data="delete">Delete List</ion-item>
  </ion-list>
</template>

<script>
import { IonList, IonItem } from "@ionic/vue";

export default {
  props: ["list", "action"],
  components: {
    IonList,
    IonItem,
  },
};
</script>
