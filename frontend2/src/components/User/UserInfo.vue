<template>
  <div id="user-info" class="list-row">
    <div class="avatar">
      <svg width="100%" height="100%" :data-jdenticon-value="username"></svg>
    </div>
    <div class="list-title">
      {{ username }}
    </div>
    <div class="buttons">
      <!--a href="#" v-on:click.prevent="logout">log</a-->
      <i class="fas fa-ellipsis-v"></i>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UserInfo",
  data() {
    return {
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
    ...mapActions(["info", "logout"]),
    async fetch() {
      let res = await this.info();
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
