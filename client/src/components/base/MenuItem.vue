<template>
  <ion-item @click="click($event)" id="awiegl" width="300" detail="false" button="true" :data="data">
    <ion-label class="menu-title">{{ label }}</ion-label>
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
  methods: {
    click( evt ){
      if( evt.target.tagName == "ION-ITEM" )
        evt.target.querySelector( "ion-icon").click();
    }
  }
};
</script>
<style scoped>
.menu-title {
  font-size: 1.2em !important;
}
.menu-icon {
  color: #444;
  zoom: 1.1;
}
</style>

