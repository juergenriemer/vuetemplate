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
      offlineTolerance :2000,
      cloudOffline,
      offline : null,
      offlineInfo : null,
      syncInfo : null,
      allowedActions: [
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
      this.offline = true;
      const offlineSince = localStorage.getItem( "offine-since");
      if( !offlineSince ) localStorage.setItem("offline-since", this.now());
      this.showOfflineInfo();
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
            setTimeout( () => {
              if( window.$$.network == "offline") this.setOfflineMode();
            }, this.offlineTolerance )
            // REF: wait 10 secs before doing
            break;
        }
      });
    },
    // REF: DONST SEND invitees in list object to users only to owner
    connectToSocket() {
        this.waitFor().then(() => {
          const socket = io(process.env.VUE_APP_SOCKET);
          const csrf = sessionStorage.getItem("csrf");
          socket.on("connect", () => {
            let user = this.$store.getters.user;
            socket.emit("join", { userId: user._id, csrf });
            window.$$.network = "online";
            window.bus.emit("network-status");
          });
          socket.on("disconnect", () => {
            window.$$.network = "offline";
            window.bus.emit("network-status");
          });
          socket.on(csrf, (res) => {
            let { type, data } = res;
            console.log( "socket", type, data)
            data.socket = true;
            if (this.allowedActions.includes(type))
              this.$store.dispatch(type, data);
          });
        });
    },
    waitFor() {
      return new Promise(function (resolve, reject) {
        (function waitForFoo() {
          if (sessionStorage.getItem("csrf")) return resolve();
          console.log( 'x')
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
