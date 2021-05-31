<template>
  <ion-icon
    @click="showOfflineInfo()"
    id="offline"
    v-if="offline"
    slot="icon-only"
    :icon="cloudOffline"
    size="small"
  ></ion-icon>
</template>

<script>
//import { bus } from "@/main";

import { IonButton, IonIcon } from "@ionic/vue";
import { cloudOffline } from "ionicons/icons";
import { alertController } from "@ionic/core";
import Dates from "@/mixins/Dates";
import * as io from "socket.io-client";

export default {
  mixins: [Dates],
  components: {
    IonIcon,
  },
  data() {
    return {
      socketId : null,
      listening : false,
      offlineTolerance :2000,
      cloudOffline,
      offline : null,
      offlineInfo : null,
      syncInfo : null,
      allowedActions: [
        "invite",
        "addList",
        "updateList",
        "deleteList",
        "updateItem",
        "addItem",
        "deleteItem",
        "addComment",
        "removeComment",
        "toggleList",
        "toggleAdmin",
        "reorderList",
        "unshare",
      ],
    };
  },
  created() {
    if( window.$$.appMode == "online" ) {
      if( window.$$.network == "offline") this.setOfflineMode();
      this.listenOnNetworkStatus();
      this.connectToSocket();
    }
  },
  methods: {
    setOfflineMode() {
      console.log( '>>>>>> setOfflineMode')
      this.offline = true;
      this.hideAlerts();
      const offlineSince = localStorage.getItem( "offline-since");
      if( !offlineSince ) {
        localStorage.setItem("offline-since", this.now());
      // only show offline info if we first enter offline mode
        this.showOfflineInfo();
      }
    },
    hideAlerts() {
      if (this.offlineInfo && !this.offlineInfo._detached) this.offlineInfo.dismiss();
      if (this.syncInfo && !this.syncInfo._detached) this.syncInfo.dismiss();
      this.offlineInfo = null;
      this.syncInfo = null;
    },
    async showOfflineInfo() {
      alertController
        .create({
          header: "You are currently offline",
          message: `<p>We cannot connect to our Listle servers.</p>
          <p>However, you can continue to work, all lists will 
        get synchronized as soon as a connection can be re-established.
         </p>
          <p>All functions related to sharing lists will be deactivated until back online.</p>
         <p><a href="#">Learn more about synchronizing</a></p>
          `,
          buttons: [
            {
              text: "OK",
              handler: () => {},
            },
          ],
        })
        .then((res) => {
          this.hideAlerts();
          this.offlineInfo = res;
          this.offlineInfo.present();
        });
    },
    async showSyncInfo() {
      alertController
        .create({
          header: "Synchronize with the server",
          message: `<p>Do you want to synchronize changes NOW?</p>
						<p>You can synchronize LATER using the personal menu, or you 
							DISCARD all changes and load data from the server </p>
          `,
          buttons: [
            {
              text: "Discard",
              handler: () => {
                localStorage.removeItem("sOD");
                localStorage.removeItem("offline-since");
                self.location.reload();
              },
            },
            {
              text: "LATER",
              handler: () => {},
            },
            {
              text: "NOW",
              handler: () => {
                this.nav("/user/synchronize");
              },
            },
          ],
        })
        .then((res) => {
          this.hideAlerts();
          this.syncInfo = res;
          this.syncInfo.present();
        });
    },
    listenOnNetworkStatus() {
      window.bus.on("network-status", () => {
        switch (window.$$.network) {
          case "online":
            this.offline = false;
            this.hideAlerts();
            if (window.checkNeedForSync()) this.showSyncInfo();
            break;
          case "offline":
            // wait a bit before telling user
            console.log( "really offline now?")
            setTimeout( () => {
              if( window.$$.network == "offline" && ! this.offline) {
                // trigger just once
                console.log( 'set offline mode')
                  this.setOfflineMode();
                }
            }, this.offlineTolerance )
            break;
        }
      });
    },
    // REF: DONST SEND invitees in list object to users only to owner
    connectToSocket() {
        const socket = io(process.env.VUE_APP_SOCKET);
          socket.on("disconnect", () => {
            console.log( "DISCONNECT")
            window.$$.network = "offline";
            window.bus.emit("network-status");
          });
        socket.on("connect", () => {
          console.log( "CONNNNNNNNNNNNECTTTT")
          window.$$.network = "online";
          window.bus.emit("network-status");
            this.waitFor().then(( csrf ) => {
              console.warn( "> init join > " + csrf)
              const user = this.$store.getters.user;
              socket.emit("join", { userId: user._id, csrf });
              if( ! this.listening ) {
                this.listening = true;
                socket.on(csrf, (res) => {
                  let { type, data } = res;
                  console.log( "socket", type, data)
                  data.socket = true;
                  if (this.allowedActions.includes(type))
                    this.$store.dispatch(type, data);
                  else if( type == "info") {
                      alert( data.message )
                  }
                });
              }
            });
        });
          console.log( '??1')
          /*
        socket.once('connect_error', err => {
          console.log( '??')
          console.log( "IIIII error code: " + err)
          if( /Error: xhr poll error/.test( err )){
                console.warn( "IIII TRIGGER OFFLINE!!!")
                  window.$$.network = "offline";
                  window.bus.emit("network-status");
          }
        });
           */
    },
    waitFor() {
      return new Promise(function (resolve, reject) {
        (function waitForFoo() {
          const csrf = sessionStorage.getItem("csrf")
          if ( csrf ) return resolve(csrf );
          console.log( 'polling for csrf')
          setTimeout(waitForFoo, 1000);
        })();
      });
    },
  },
};
</script>
<style>
#offline {
  z-index: 100;
  position: fixed;
  left: 50%;
  height: 30px;
  width: 30px;
  top: 13px;
  color: crimson;
  cursor: pointer;
}
</style>
