<template>
  <ion-app>
    <socket />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
// global functions
window.isWeb = false;

/*
window.onerror = (a, b, c) => {
alert(a);
};
window.console.warn = (a) => {
 alert(a);
};
window.console.log = (a) => {
 alert(a);
};
*/
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Socket from "./Socket.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Socket,
  },
});
</script>
<style>
/* item checkboxes */
.checkbox {
  background: #c0c0c0;
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

.title {
  padding-left: 10px;
}
</style>
