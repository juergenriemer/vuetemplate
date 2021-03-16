<template lang="pug">
#user-info
  .avatar(:style="{ background: avatarColor(short) }") {{ short }}
  .title {{ firstName }} {{ lastName }}
  .menu
    i.fas.fa-ellipsis-v
    ul(@click="menu($event)")
      li(data-link="invites") My Invitations
      li(data-link="logout") Logout
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Menu from "@/mixins/Menu";
import { bus } from "@/main";

export default {
  name: "UserInfo",
  mixins: [Menu],
  data() {
    return {
      showMenu: false,
      userid: "",
      firstName: "",
      lastName: "",
      email: "",
      short: "",
    };
  },
  computed: mapGetters(["user"]),
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["info", "logout"]),
    async init() {
      this.info().then((res) => {
        this.userid = localStorage.getItem("userid");
        this.firstName = localStorage.getItem("firstName");
        this.lastName = localStorage.getItem("lastName");
        this.short = this.firstName.charAt(0) + this.lastName.charAt(0);
      });
    },
    menu(evt) {
      const link = evt.target.getAttribute("data-link");
      switch (link) {
        case "invites":
          bus.$emit("showInfo", "approve-invites");
          break;
        case "logout":
          this.logout();
          break;
      }
      this.showMenu = false;
    },
  },
};
</script>
<style>
</style>
