<template>
  <ion-list lines="none" @click="action">
    <ion-item button="true" data="info" @click="nav(`/list/info/${list._id}`)">
      List Info
    </ion-item>
    <ion-item
      button="true"
      data="members"
      @click="nav(`/list/members/${list._id}`)"
    >
      Share List
    </ion-item>
    <ion-item button="true" data="manage">Edit List</ion-item>
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
