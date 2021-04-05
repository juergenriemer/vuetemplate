<template>
  <ion-list lines="none" @click="action($event)">
    <ion-item button="true" data="showMode">{{ showText }}</ion-item>
    <ion-item button="true" data="toggleMode">{{ toggleText }}</ion-item>
    <ion-item button="true" data="reorderMode">{{ reorderText }}</ion-item>
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
    showText() {
      return this.showMode ? "Hide done items" : "Show all items";
    },
    reorderText() {
      return this.reorderMode ? "Stop reodering" : "Reorder items";
    },
    toggleText() {
      return this.toggleMode ? "Mark all items undone" : "Mark all items done";
    },
  },
};
</script>
