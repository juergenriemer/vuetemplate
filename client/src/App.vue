<template>
  <ion-app>
    <socket />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
// global functions
//ionic build
// to updateuse: npx cap copy
// npx cap open android

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

form#bottom-input,
form#bottom-input ion-toolbar {
  background: #efefef;
  display: flex;
  --min-height: 30px !important;
  --background: #efefef;
}
form#bottom-input ion-buttons {
  margin-bottom: 3px;
  align-self: flex-end;
}
form#bottom-input ion-fab {
  align-self: flex-end;
  margin-bottom: -8px;
}

form#bottom-input input {
  background: white;
  border-radius: 5px;
}
.textarea {
  border-radius: 15px;
  background: white;
  max-height: 90px;
  overflow: auto;
}
::-webkit-scrollbar {
  background-color: #696969;
  width: 8px;
  height: 8px;
}
/* https://npm.io/package/ion-custom-scrollbar */
::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}
::-webkit-scrollbar-track {
  background: #e0e0e0;
}
</style>
