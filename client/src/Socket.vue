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
import socketClient from "socket.io-client";

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
      serverInfo : null,
      allowedActions: [
        "invite",
        "addList",
        "updateList",
        "deleteList",
        "updateItem",
        "addItem",
        "deleteItem",
        "addComment",
        "deleteComment",
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
      this.offline = true;
      this.hideAlerts();
      const offlineSince = sessionStorage.getItem( "offline-since");
      alert( offlineSince )
      if( !offlineSince ) {
        // REF: on login page we need another  essage or at least redirect to 
        // lists... for registration we need sg completely different
        sessionStorage.setItem("offline-since", this.now());
      // only show offline info if we first enter offline mode
        this.showOfflineInfo();
      }
    },
    hideAlerts() {
      if (this.offlineInfo && !this.offlineInfo._detached) this.offlineInfo.dismiss();
      if (this.syncInfo && !this.syncInfo._detached) this.syncInfo.dismiss();
      if (this.serverInfo && !this.serverInfo._detached) this.serverInfo.dismiss();
      this.offlineInfo = null;
      this.syncInfo = null;
      this.serverInfo = null;
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
            setTimeout( () => {
              if( window.$$.network == "offline" && ! this.offline) {
                // trigger just once
                  this.setOfflineMode();
                }
            }, this.offlineTolerance )
            break;
        }
      });
    },
    // REF: DONST SEND invitees in list object to users only to owner
    connectToSocket() {
      const socket = socketClient(process.env.VUE_APP_BACKEND);
          socket.on("disconnect", () => {
            window.$$.network = "offline";
            window.bus.emit("network-status");
          });
        socket.on("connect", () => {
          window.$$.network = "online";
          window.bus.emit("network-status");
          this.waitFor().then(( csrf ) => {
            const user = this.$store.getters.user;
            socket.emit("join", { userId: user._id, csrf });
            if( ! this.listening ) {
              this.listening = true;
              socket.on(csrf, (res) => {
                let { type, data } = res;
                console.log( "socket", type, data)
                if (this.allowedActions.includes(type)) {
                  data.socket = true;
                  this.$store.dispatch(type, data);
                }
                else if( type == "info") {
                  this.showServerInfo( data );
                }
              });
            }
          });
        });
    },
    async showServerInfo( data ) {
      const close = ( url ) => {
        console.log( data.button, this.$route.path )
        if( data.event == "unshare") {
          if( this.$route.params && this.$route.params.id == data.listId ) {
            this.nav( "/app/list" )
          }
        }
        else if( data.button && ( data.button.url == this.$route.path ) ) {
          console.log( "!!!reload" )
          self.location.reload();
        }
      };
      const buttons = [
        {
          text: "CLOSE",
          handler: () => close()
        }
      ];
      if( data.button ){
        buttons.push({
          text: data.button.text,
          handler: () => {
            close();
            this.nav( data.button.url );
          }
        })
      }
      alertController
        .create({
          header: "Notification!",
          message : data.message ,
          buttons,
        })
        .then((res) => {
          this.hideAlerts();
          this.serverInfo = res;
          this.serverInfo.present();
        });
    },
    waitFor() {
      return new Promise(function (resolve, reject) {
        (function waitForFoo() {
          const csrf = sessionStorage.getItem("csrf")
          if ( csrf ) return resolve(csrf );
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
