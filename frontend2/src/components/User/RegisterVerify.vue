<template>
  <div class="row" id="user">
    <div class="left column">
      <div id="RegisterVerify">
        <h3>Verify your registration</h3>
        <p v-if="status == 'expired'">
          The link expired.<br />
          Please try to register again.
        </p>
        <p v-if="status == 'invalid'">
          The link is not valid.<br />
          Please check if the link was properly pasted.
        </p>
        <div v-if="invites">
          <h6>You are invited to the fllowong lists</h6>
          <div
            class="list-row"
            @bouclick="toggle(invite_.id)"
            @click="approves[invite._id] = !approves[invite._id]"
            v-for="invite in invites"
            :key="invite._id"
          >
            <div class="checkbox">
              <i v-if="approves[invite._id]" class="fas fa-check-square"></i>
              <i v-if="!approves[invite._id]" class="far fa-check-square"></i>
            </div>
            <div class="list-title">
              {{ invite.title }}
            </div>
          </div>
          <div class="buttons">
            <button class="secondary green">cancel</button>
            <button class="primary green" @click="approve">INVITE</button>
          </div>
        </div>
      </div>
    </div>
    <!--div class="right column"></div-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    invites: [],
    approves: {},
    status: "verifying...",
  }),
  created() {
    this.verify();
  },
  methods: {
    ...mapActions(["verifyRegistration", "approveInvites"]),
    async verify() {
      const token = this.$route.params.token;
      const res = await this.verifyRegistration(token);
      console.log(res);
      if (res && res.data && res.data.userdata) {
        //if (res && res.data && res.data.is_verified) {
        if (res.data.lists) {
          this.invites = res.data.lists;
          this.approves = this.invites.reduce((map, list) => {
            map[list._id] = true;
            return map;
          }, {});
        } else {
          this.$router.push("/main");
        }
      } else {
        this.status = res;
      }
    },
    async approve() {
      const res = await this.approveInvites({
        approves: this.approves,
        lists: this.invites.filter((inv) => this.approves[inv._id]),
      });
      console.log(res);
      this.$router.push("/main");
    },
  },
};
</script>
<style>
.list-row {
  display: flex;
  position: relative;
  border-bottom: 1px solid #f2f2f2;
  line-height: 49px;
  cursor: pointer;
  color: #000;
}
.list-row:active {
  background: #ebebeb;
}
.list-row:hover {
  background: #f5f5f5;
}
.list-row a {
  text-decoration: none;
}
.list-row a:active,
.list-row a:visited {
  color: #000;
}
.list-row .bulb {
  position: relative;
}
.list-row .avatar {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 3px;
}

.list-row .badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  margin-top: 1px;
  margin-right: 1px;
  font-weight: bold;
  font-size: 11px;
  line-height: 16px;
  color: white;
  width: 16px;
  height: 16px;
  text-align: center;
  border-radius: 50%;
  background: red;
  border: 2px solid white;
}
.list-title {
  position: relative;
  margin-right: auto;
  flex-basis: 20px;
  flex-grow: 1;
}
.list-title a {
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 17px;
}
/* samecss as in app.vue */
#RegisterVerify .buttons {
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  padding: 24px;
}
#RegisterVerify .buttons button {
  text-transform: uppercase;
  transition: box-shadow 0.2s ease-out, background 0.2s ease-out,
    color 0.2s ease-out;
  padding: 12px 24px;
  border-radius: 3px;
  border: 0;
}
#RegisterVerify .buttons button:hover {
  box-shadow: 3px 3px 3px #c0c0c0;
}
#RegisterVerify .buttons button:focus {
  outline: none;
}
.modal .title {
  font-size: 20px;
  font-weight: 400;
}

#RegisterVerify .primary {
  color: #fff;
  background: #ff5f49;
}
#RegisterVerify .primary.green {
  color: #fff;
  background: #3ba559;
}
</style>
