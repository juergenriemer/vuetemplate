<template>
  <div id="user-info">
    <div class="avatar" :style="{ background: avatarColor(short) }">
      {{ short }}
    </div>
    <div class="title">{{ firstName }} {{ lastName }}</div>
    <div class="menu buttons">
      <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
      <div
        id="menu"
        v-if="showMenu"
        style="transform-origin: right top; transform: scale(1); opacity: 1"
      >
        <ul @click="menu($event)">
          <li data-link="invites">My Invitations</li>
          <li data-link="logout">Logout</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
export default {
  name: "UserInfo",
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
