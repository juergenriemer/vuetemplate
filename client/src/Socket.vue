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
import mitt from "mitt";
window.bus = mitt();

export default {
  mixins: [Dates],
  components: {
    IonIcon,
  },
  mounted() {
    this.synchronize();
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
         <button @click="synchronize()">sync</button>
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
            return;
            const localLists = this.$store.getters.lists;
            this.$store
              .dispatch("synchronize", { localLists })
              .then(() => {})
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
            // REF: wait 10 secs before doing
            localStorage.setItem("offline-since", this.now());
            if (!this.offline) this.showOfflineInfo();
            this.offline = true;
            window.networkStatus = "offline";
            break;
        }
      });
    },
    // REF: DONST SEND invitees in list object to users only to owner
    synchronize() {
      const lists = [...this.$store.getters.lists];
      const offlineChanges = this.getOfflineChanges(lists);
      console.log(offlineChanges);
      let sOD = localStorage.getItem("sOD");
      const offlineDeletions = sOD ? JSON.parse(sOD) : [];
      const actions = [...offlineChanges, ...offlineDeletions];
      console.log(actions);
      return;
      /*
      this.$store
        .dispatch("rawLists")
        .then((res) => {
        .catch((err) => {
          console.warn(err);
        });
          */
    },
    connectToSocket() {
      if (!this.isLocal) {
        this.waitFor().then(() => {
          const socket = io(process.env.VUE_APP_SOCKET);
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
    getOfflineChanges(lists) {
      let result = [];
      let Processed = new Map();
      const inspect = function (item) {
        Object.keys(item).forEach((key) => {
          if (key !== "parent" && typeof item[key] === "object") {
            inspect(item[key]);
          }
          if (item.offline === true && !Processed[item._id]) {
            let type, order;
            let params = {};
            let action = /^id/.test(item._id) ? "add" : "update";
            let p = item.parent.parent;
            if (!p) {
              // list
              type = "list";
              order = 1;
              params[type] = (({ title, description }) => ({
                title,
                description,
              }))(item);
            } else {
              let parentId = p._id;
              p = p.parent.parent;
              if (!p) {
                type = "item";
                order = 2;
                params[type] = (({ title, done }) => ({ title, done }))(item);
                params.listId = parentId;
              } else {
                type = "comment";
                order = 3;
                params[type] = (({ text, imageFile }) => ({
                  text,
                  imageFile,
                }))(item);
                params.listId = p._id;
                params.itemId = parentId;
              }
            }
            if (action == "update") params[`${type}Id`] = item._id;
            const method =
              action + type.charAt(0).toUpperCase() + type.slice(1);
            Processed[item._id] = true;
            result.push({
              order,
              method,
              params,
            });
          }
        });
      };
      var addParent = {
        set: function (target, prop, value) {
          if (typeof value === "object") {
            var p = new Proxy({ parent: target }, addParent);
            for (var key in value) {
              p[key] = value[key];
            }
            return (target[prop] = p);
          } else {
            target[prop] = value;
            return true;
          }
        },
      };
      let data = new Proxy({}, addParent);
      Object.assign(data, lists);
      inspect(data);
      return result;
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
