<template>
  <ion-item button="true" :data="token">
    <ion-label class="title">{{ label }}</ion-label>
    <ion-icon :icon="icon" size="small"></ion-icon>
  </ion-item>
</template>
<script>
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
export default {
  props: ["token", "label", "icon"],
  components: {
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
  },
};
</script>
<style>
</style>

