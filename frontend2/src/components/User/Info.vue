<template>
  <div id="user-info">
    [{{ username }}] [{{ userid }}] <a href="#/logout">logout</a>|
    <a href="#/login">login</a>| <a href="#/register">register</a>||
    <a href="#/">home</a>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  //  name: "UserInfo",
  data() {
    return {
      socket: "xxx",
      userid: "",
      username: "",
    };
  },
  computed: mapGetters(["user"]),
  created() {
    if (!this.user.username) {
      this.fetch();
    }
    this.userid = localStorage.getItem("userid");
    this.username = localStorage.getItem("username");
  },
  methods: {
    ...mapActions(["info"]),
    async fetch() {
      let res = await this.info();
    },
  },
};
</script>
<style>
</style>
