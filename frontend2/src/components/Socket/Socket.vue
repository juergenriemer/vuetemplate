<template>
  <div id="xxx">xxx</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "xxxUserSocket",
  data() {
    return {
      socket: "xxx",
      userid: "",
      username: "",
    };
  },
  sockets: {
    connect() {
      console.warn("CONNECTED");
    },
  },
  computed: mapGetters(["user", "lists"]),
  created() {
    this.checkForUpdates();
    this.userid = localStorage.getItem("userid");
    this.username = localStorage.getItem("username");
    this.sockets.subscribe(this.userid, (data) => {
      this[`${data.type}Extern`](data);
      console.warn(".......socker......", data);
    });
  },
  methods: {
    ...mapActions(["addItemExtern", "updateItemExtern", "removeItemExtern"]),
  },
};
</script>
<style>
</style>
