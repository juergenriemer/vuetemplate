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

#bottom-input {
  background: #efefef;
  border-top: 1px #c0c0c0 solid;
  padding: 10px;
}
#bottom-input ion-toolbar {
  --min-height: 30px;
  --background: #efefef;
}
#bottom-input ion-toolbar input {
  background: white;
  border-radius: 5px;
}
.textarea {
  border-radius: 15px;
  background: white;
  max-height: 90px;
  overflow: auto;
}

.scroller::-webkit-scrollbar {
  width: 8px;
}
.scroller::-webkit-scrollbar-thumb {
  background: #c0c0c0;
}
.scroller::-webkit-scrollbar-track {
  background: #e0e0e0;
}
</style>
