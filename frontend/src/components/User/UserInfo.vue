<template lang="pug">
#user-info
  .avatar(:style="{ background: avatarColor(short) }") {{ short }}
  .title {{ user.firstName }} {{ user.lastName }}
  .menu
    i.fas.fa-ellipsis-v
    ul(@click="menu($event)")
      li(data-link="invites", v-if="!isLocal") My Invitations
      li(data-link="logout", v-if="!isLocal") Logout
      li(data-link="createAccount", v-if="isLocal") Create Account
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Menu from "@/mixins/Menu";
import { bus } from "@/main";

export default {
  name: "UserInfo",
  mixins: [Menu],
  data() {
    return {};
  },
  computed: { ...mapGetters(["user", "short"]) },
  created() {
    if (!this.isLocal)
      this.info().then((res) => {
        // I am online
      });
  },
  methods: {
    ...mapActions(["info", "logout"]),
    menu(evt) {
      const link = evt.target.getAttribute("data-link");
      switch (link) {
        case "invites":
          bus.$emit("showInfo", "approve-invites");
          break;
        case "logout":
          this.logout();
          break;
        case "createAccount":
          alert("not yet implemented");
          break;
      }
    },
  },
};
</script>
<style>
</style>
