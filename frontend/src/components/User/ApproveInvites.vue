<template lang="pug">
#user.row
  .left.column
    .form
      h3 Approve invitations
      w-form
        p
          | You have been invited to join lists.
        p
          | Select the ones you want and join.
        .rows
          .row(
            v-for="invite in invites",
            :key="invite._id",
            @click="approves[invite._id] = !approves[invite._id]"
          )
            .w-flex
              w-checkbox(v-model="approves[invite._id]") {{ invite.title }}
          .buttons
            w-button.ma1(
              bg-color="primary",
              color="white",
              md,
              shadow,
              :disabled="sending",
              :loading="sending",
              @click="submit"
            ) JOIN
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "ApproveInvites",
  mixins: [Form],
  data: () => ({
    approves: {},
    invites: [],
  }),
  created() {
    this.getListInvites();
  },
  methods: {
    ...mapActions(["approveInvites", "listInvites"]),
    async getListInvites() {
      this.listInvites()
        .then((res) => {
          this.status = "OK";
          console.log(res);
          if (res.data && res.data.lists) {
            this.invites = res.data.lists;
            this.approves = this.invites.reduce((map, list) => {
              map[list._id] = true;
              return map;
            }, {});
          }
        })
        .catch((err) => {
          switch (err.status) {
            case 422:
              this.status = err.message;
              break;
            default:
              this.status = "idle";
              this.showError(err);
              break;
          }
        });
    },
    async submit() {
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
