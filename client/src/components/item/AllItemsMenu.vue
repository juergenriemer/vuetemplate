<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="toggleMode"
      >Mark all items {{ toggleText }}</ion-item
    >
    <ion-item button="true" data="reorderMode"
      >Turn {{ reorderText }} reorder mode</ion-item
    >
  </ion-list>
</template>
<script>
import { IonList, IonItem } from "@ionic/vue";

export default {
  props: ["action", "reorderMode", "toggleMode"],
  components: {
    IonList,
    IonItem,
  },
  computed: {
    reorderText() {
      return this.reorderMode ? "off" : "on";
    },
    toggleText() {
      return this.toggleMode ? "undone" : "done";
    },
  },
};
</script>
