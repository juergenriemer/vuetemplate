<template>
  <ion-app>
    <Socket></Socket>
    <ion-router-outlet animated="true" />
    <!-- animated geht vielleicht wieder? -->
  </ion-app>
</template>

<script lang="ts">
/* notes 
run this in /android folder!
use "android" as password and take SHA1 that shows up for google dev page
keytool -list -v \
-alias androiddebugkey -keystore ~/.android/debug.keystore

ionic build ; npx cap copy android ; npx cap open android

*/
// global functions
//ionic build
// to updateuse: npx cap copy
// npx cap open android
/* bugs/todo 
O dark mode in ipad: https://ionicframework.com/docs/theming/dark-mode
O no offline mode when menu is open
O if ajax before socket in offline... broken when reordering
O socket message not sent if user gets back online after other user already got online and added item (test with settimeout for particular csrf)
O Prevent deletion of items if now allowed also in offline mode
X toggle all does not account for inital state (e.g. all done)
*/
window.isWeb = true;
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
  alert("err: " + JSON.stringify(a) );
  //console.warn( "********************")
  //console.warn( a,b,c)
  //console.warn( "********************")
  return true;
};
/*
window.console.warn = (a) => {
  alert("warn: " + JSON.stringify(a) );
};
window.console.log = (a) => {
  alert("log: " + JSON.stringify(a) );
};
 */
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

</style>
