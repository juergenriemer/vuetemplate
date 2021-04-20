<template>
  <ion-item button="true" :data="data">
    <ion-label class="title">{{ label }}</ion-label>
    <ion-icon slot="end" class="menu-icon" :icon="icon" size="small"></ion-icon>
  </ion-item>
</template>
<script>
import { IonIcon, IonItem, IonLabel } from "@ionic/vue";
export default {
  props: ["data", "label", "icon"],
  components: {
    IonIcon,
    IonItem,
    IonLabel,
  },
};
</script>
<style scoped>
.title {
  font-size: 1.2em !important;
}
.menu-icon {
  color: #444;
  zoom: 1.1;
}
</style>

