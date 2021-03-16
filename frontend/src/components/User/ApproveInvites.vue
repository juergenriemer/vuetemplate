<template lang="pug">
.form
  w-form
    p
      | You have been invited to join lists.
    p
      | Select the ones you want and join.
    .rows
      .row(v-for="invite in invites", :key="invite._id")
        .w-flex
          w-checkbox(
            v-model="approves[invite._id]",
            @click="approves[invite._id] = !approves[invite._id]"
          ) {{ invite.title }}
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
import { bus } from "../../main";
import Form from "@/mixins/Form";
export default {
  name: "ApproveInvites",
  mixins: [Form],
  props: ["hide"],
  data: () => ({
    approves: {},
    invites: [],
  }),
  created() {
    this.getListInvites();
    bus.$on("showApproveInvites", (isShown) => {
      this.hide = !isShown;
    });
  },
  methods: {
    ...mapActions(["approveInvites", "myInvites"]),
    async getListInvites() {
      this.myInvites()
        .then((res) => {
          this.status = "OK";
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
