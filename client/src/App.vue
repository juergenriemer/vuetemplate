<template>
  <ion-app>
    <socket v-if="app" />
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
// global functions
//ionic build
// to updateuse: npx cap copy
// npx cap open android
/* bugs/todo 
O no offline mode when menu is open
O if ajax before socket in offline... broken when reordering
O socket message not sent if user gets back online after other user already got online and added item (test with settimeout for particular csrf)
O Prevent deletion of items if now allowed also in offline mode
X toggle all does not account for inital state (e.g. all done)
*/
import mitt from "mitt";
window.bus = mitt();

window.$$ = {
  network : "unkown"
  , appMode : localStorage.getItem( "appMode") || "online"
};
window.isWeb = false;
window.networkStatus = "unknown";
window.initialDataLoad = false;
window.appConnectionMode = "online";
window.checkNeedForSync = () => {
  const deletions = localStorage.getItem("sOD");
  if( deletions ) console.warn( "!!!sync needed: deletions")
  if( deletions ) return true;
  const localStore = localStorage.getItem( "store")
  if( localStore ) {
    const store = JSON.parse( localStore );
    let modifications = false;
    const check = ( elems ) => {
      for( let elem in elems ){
        if( typeof( elems[elem]) == "object" && ! modifications) check( elems[elem] )
        else if( elem == "offline" ) { console.warn( elems);modifications = true;}
      }
    }
    if( store && store.list && store.list.lists ) check( store.list.lists)
    if( modifications ) console.warn( "!!!sync needed: offline activity")
    return modifications;
  }
  else return false;
}
window.onerror = (a, b, c) => {
  alert(a);
};
//window.console.warn = (a) => {
// alert(a);
//};
//window.console.log = (a) => {
// alert(a);
//};
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Socket from "./Socket.vue";
import { defineComponent } from "vue";
import router from "./router";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    Socket,
  },
  computed: {
    app() {
      const path = router.currentRoute._value.path;
      return path && path.substring(1, 4) == "app";
    },
  },
});
</script>
<style>
/* BaseLayout.vue */
ion-header .header-icon {
  padding-right: 8px;
}
ion-header ion-title {
  padding-right: 0px;
}
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
