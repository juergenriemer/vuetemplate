<template>
  <div></div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
// import io from "socket.io-client";
export default {
  name: "UserSocket",
  data() {
    return {};
  },
  computed: mapGetters(["user", "lists"]),
  created() {
    this.waitFor().then(() => {
      const socket = io("ws://192.168.1.27:3003");
      const userId = localStorage.getItem("userid");
      const csrf = sessionStorage.getItem("csrf");
      socket.on("connect", () => {
        socket.emit("join", { userId, csrf });
      });
      socket.on(csrf, (data) => {
        console.log("call: " + data.type + "Extern");
        this[`${data.type}Extern`](data);
      });
    });
  },
  methods: {
    ...mapActions([
      "addItemExtern",
      "updateItemExtern",
      "removeItemExtern",
      "addCommentExtern",
      "removeCommentExtern",
    ]),
    waitFor() {
      return new Promise(function (resolve, reject) {
        (function waitForFoo() {
          if (sessionStorage.getItem("csrf")) return resolve();
          console.log("...wait for csrf to arrive");
          setTimeout(waitForFoo, 30);
        })();
      });
    },
    seenList(state, listId) {
      let missed = localStorage.getItem("missed");
      let list = state.lists.find((list) => list._id == listId);
      if (list) {
        missed = missed ? JSON.parse(missed) : {};
        if (missed[list._id]) {
          missed[list._id] = {
            lastSeen: new Date().toString(),
            number: 0,
          };
          Vue.set(list, "meta", {
            added: 0,
            updated: 0,
            removed: 0,
          });
        }
        localStorage.setItem("missed", JSON.stringify(missed));
      }
    },
    checkForUpdates(state) {
      let missed = localStorage.getItem("missed");
      missed = missed ? JSON.parse(missed) : {};
      state.lists.forEach((list) => {
        if (!missed[list._id]) {
          missed[list._id] = {
            lastSeen: new Date().toString(),
          };
        }
        missed[list._id].number = 0;
        list.items.filter((item) => {
          const itemDate = new Date(item.updatedAt);
          const lastDate = new Date(missed[list._id].lastSeen);
          let miss = itemDate > lastDate;
          if (miss) missed[list._id].number++;
        });
        Vue.set(list, "meta", {
          added: 0,
          updated: missed[list._id].number,
          removed: 0,
        });
      });
      localStorage.setItem("missed", JSON.stringify(missed));
    },
  },
};
</script>

