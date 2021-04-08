<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="delete-item">Delete this comment</ion-item>
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
