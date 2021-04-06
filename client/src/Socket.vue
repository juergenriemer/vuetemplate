<template>
  <div></div>
</template>

<script>
//import { bus } from "@/main";

import * as io from "socket.io-client";

export default {
  components: {},
  data() {
    return {
      status: "online",
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
    if (!this.isLocal) {
      this.waitFor().then(() => {
        //const socket = io("ws://192.168.1.27:3003");
        const socket = io("ws://10.0.0.136:3003");
        const csrf = sessionStorage.getItem("csrf");
        socket.on("connect", () => {
          //         bus.$emit("showOffline", false);
          socket.emit("join", { userId: this.userId, csrf });
        });
        socket.on(csrf, (res) => {
          let { type, data } = res;
          data.socket = true;
          if (this.allowedActions.includes(type))
            this.$store.dispatch(type, data);
        });
        socket.on("disconnect", () => {
          // bus.$emit("showOffline", true);
        });
      });
    }
  },
  methods: {
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
</style>
