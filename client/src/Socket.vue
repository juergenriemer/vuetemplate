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

import appConfig from "@/config.js";
import { IonButton, IonIcon } from "@ionic/vue";
import { cloudOffline } from "ionicons/icons";
import { alertController } from "@ionic/core";
import * as io from "socket.io-client";
import mitt from "mitt";
window.bus = mitt();

export default {
  components: {
    IonIcon,
  },
  data() {
    return {
      infoWindow: null,
      cloudOffline,
      offline: false,
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
  computed: {
    userId() {
      let user = this.$store.getters.user;
      return user ? user._id : "";
    },
  },
  created() {
    this.listenOnNetworkStatus();
    if (window.networkStatus !== "offline") {
      this.connectToSocket();
    } else {
      this.offline = true;
      this.showOfflineInfo();
    }
  },
  methods: {
    async showOfflineInfo() {
      alertController
        .create({
          header: "You are currently offline",
          message: `<p>We cannot connect to our Listle servers.</p>
          <p>However, you can continue to work, all lists will 
        get synchronized as soon as a connection can be re-established.
         </p>
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
          if (this.infoWindow) this.infoWindow.dismiss();
          this.infoWindow = res;
          this.infoWindow.present();
        });
    },
    async confirmSynchronization() {
      alertController
        .create({
          header: "Synchronize with the server",
          message: `<p>Do you want to synchronize changes?</p>
          `,
          buttons: [
            {
              text: "OK",
              handler: () => {
                this.synchronize();
              },
            },
          ],
        })
        .then((res) => {
          if (this.infoWindow) this.infoWindow.dismiss();
          this.infoWindow = res;
          this.infoWindow.present();
        });
    },
    listenOnNetworkStatus() {
      window.bus.on("network-status", (status) => {
        switch (status) {
          case "online":
            const localLists = this.$store.getters.lists;
            this.$store
              .dispatch("synchronize", { localLists })
              .then(() => {
              })
              .catch((err) => {
                console.warn(err);
                next();
              });
            if (this.infoWindow) this.infoWindow.dismiss();
            this.offline = false;
            window.networkStatus = "online";
            const offlineSince = localStorage.getItem("offline-since");
            if (offlineSince) this.synchronize();
            break;
          case "offline":
            localStorage.setItem("offline-since", new Date());
            if (!this.offline) this.showOfflineInfo();
            this.offline = true;
            window.networkStatus = "offline";
            break;
        }
      });
    },
    synchronize() {
      localStorage.removeItem("offline-since");
      var x = confirm("do it?");
      if (x) {
        this.$store
          .dispatch("synchronize")
          .then(() => {
          })
          .catch((err) => {
            next();
          });
      }
    },
    connectToSocket() {
      if (!this.isLocal) {
        this.waitFor().then(() => {
          //const socket = io("ws://192.168.1.27:3003");
          //const socket = io("ws://10.0.0.136:3003");
          const socket = io(appConfig.socket);
          const csrf = sessionStorage.getItem("csrf");
          socket.on("connect", () => {
            window.bus.emit("network-status", "online");
            socket.emit("join", { userId: this.userId, csrf });
          });
          socket.on(csrf, (res) => {
            let { type, data } = res;
            data.socket = true;
            return;
            if (this.allowedActions.includes(type))
              this.$store.dispatch(type, data);
          });
          socket.on("disconnect", () => {
            window.bus.emit("network-status", "offline");
          });
        });
      }
    },
    waitFor() {
      return new Promise(function (resolve, reject) {
        (function waitForFoo() {
          if (sessionStorage.getItem("csrf")) return resolve();
          setTimeout(waitForFoo, 30);
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
