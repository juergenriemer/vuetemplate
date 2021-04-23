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

var result = [];

window.res = function () {
  var s = function (item) {
    Object.keys(item).forEach((key) => {
      if (key !== "parent" && typeof item[key] === "object") {
        s(item[key]);
      }
      if (item.offline === true && !result[item._id]) {
        let type;
        let title = item.title ? item.title : item.text;
        if (item.parent && item.parent.parent && item.parent.parent._id) {
          let parent = item.parent.parent;
          if (parent.parent.parent) {
            type = "comment";
            title +=
              " (" +
              item.parent.parent.title +
              " - " +
              item.parent.parent.parent.parent.title +
              ")";
          } else {
            type = "item";
          }
          //console.log("parent: " + item.parent.parent.title);
        } else {
          type = "list";
        }
        type += /^id/.test(item._id) ? "-add" : "-update";
        console.log(type + " >> " + title);
        result[item._id] = { item };
      }
    });
  };
  var parenter = {
    set: function (target, prop, value) {
      if (typeof value === "object") {
        var p = new Proxy({ parent: target }, parenter);
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
  var root = new Proxy({}, parenter);
  //self.dmiep = { a: { b: 1, offline: true } };
  Object.assign(root, self.dmiep);
  s(root);
  console.log(result);
};
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
      let local = [...this.$store.getters.lists];
      window.dmiep = local;
      window.res();
      this.$store
        .dispatch("rawLists")
        .then((res) => {
          let local = [...this.$store.getters.lists];
          console.log("local", local);
          window.dmiep = local;
          let server = res.data.lists;
          console.log("server", server);
          let actions = [];
          // check for lists
          local
            .filter((lst) => lst.offline)
            .forEach((list) => {
              const listId = list._id;
              if (/^id/.test(listId)) {
                actions.push({
                  type: "list-add",
                  data: { list },
                });
                // and remove from further checks
                local = local.filter((lst) => lst._id != listId);
              } else
                actions.push({
                  type: "list-update",
                  data: {
                    listId: listId,
                    list: {
                      title: list.title,
                      description: list.description,
                    },
                  },
                });
            });
          local.forEach((lst) => {
            // check for items
            const listId = lst._id;
            lst.items
              .filter((itm) => itm.offline)
              .forEach((itm) => {
                const itemId = itm._id;
                if (/^id/.test(itemId)) {
                  actions.push({
                    type: "item-add",
                    data: { listId, item: itm },
                  });
                  // and remove from further checks
                  lst.items = lst.items.filter((itm) => itm._id != itemId);
                } else
                  actions.push({
                    type: "item-update",
                    data: {
                      listId,
                      itemId,
                      item: {
                        title: itm.title,
                        done: itm.done,
                      },
                    },
                  });
              });
          });
          local.forEach((lst) => {});
          console.log(".......result......");
          console.log("local", local);
          console.log("actions", actions);
          actions.forEach((act) => {
            //let title = act.data.title ? act.data.title : act.data.item.title;
            let title;
            if (act.data.list) title = act.data.list.title;
            if (act.data.item) title = act.data.item.title;
            console.log(act.type + " > " + title);
          });
        })
        .catch((err) => {
          console.warn(err);
        });

      return;
      localStorage.removeItem("offline-since");
      var x = confirm("do it?");
      if (x) {
        this.$store
          .dispatch("synchronize")
          .then(() => {})
          .catch((err) => {
            next();
          });
      }
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
