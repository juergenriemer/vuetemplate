<template>
  <ion-list @click="action">
    <ion-item data="info" :router-link="`/lists/info/${list._id}`">
      List Info
    </ion-item>
    <ion-item data="members" :router-link="`/lists/members/${list._id}`">
      Share List
    </ion-item>
    <ion-item data="share">Share List</ion-item>
    <ion-item data="manage">Edit List</ion-item>
    <ion-item data="delete">Delete List</ion-item>
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
