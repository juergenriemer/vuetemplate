<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>
<style>
/* item checkboxes */
.checkbox {
  background: grey;
  font-size: 2em;
  max-width: 40px;
  min-width: 40px;
}

.checkbox.done {
  background: green;
  color: white;
}
.checkbox [role="img"] {
  margin-left: 5px;
  margin-top: 5px;
  width: 30px;
  height: 30px;
}
</style>
