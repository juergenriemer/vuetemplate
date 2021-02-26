<template>
  <div id="user-info">
    <div class="avatar">JR</div>
    <div class="title">{{ firstName }} {{ lastName }}</div>
    <div class="menu buttons">
      <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
      <div
        id="menu"
        v-if="showMenu"
        style="transform-origin: right top; transform: scale(1); opacity: 1"
      >
        <div>
          <ul @click="menu($event)">
            <li data-link="invites">My Invitations</li>
            <li data-link="logout">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
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
        this.short = localStorage.getItem("short");
        this.firstName = localStorage.getItem("firstName");
        this.lastName = localStorage.getItem("lastName");
      });
    },
    menu(evt) {
      const link = evt.target.getAttribute("data-link");
      switch (link) {
        case "invitations":
          bus.$emit("showApproveInvites", true);
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
