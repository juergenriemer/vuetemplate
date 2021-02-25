<template>
  <div id="user-info" class="list-row">
    <div class="avatar">
      <svg width="100%" height="100%" :data-jdenticon-value="firstName"></svg>
    </div>
    <div class="list-title">{{ firstName }} {{ lastName }}</div>
    <div class="buttons">
      <i class="fas fa-ellipsis-v" @click="showMenu = !showMenu"></i>
    </div>

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
#user-info {
  height: 70px;
  top: 0;
  z-index: 3;
  background: #e0e0e0;
  border-bottom: 1px solid #c0c0c0;
  border-right: 1px solid #c0c0c0;
}

#user-info .list-row {
  display: flex;
  position: relative;
  line-height: 70px;
  cursor: pointer;
  color: #000;
}

#user-info .buttons {
  font-size: 1.3em;
  line-height: 70px;
  color: #444;
  padding-right: 1em;
}
#user-info .list-title {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 20px;
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
</style>
