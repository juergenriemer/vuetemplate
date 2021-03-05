<template lang="pug">
w-dialog.dialog(
  shadow,
  v-model="showDialog",
  transition="bounce",
  title="Share list",
  width="400"
)
  w-form(novalidate, v-if="active", @validate="validate")
    .body
      .title Invite a friend to work together on this list!
      .text Your friend will be able to add, edit and delete items as well as mark them done.
      w-input#email.center(
        label="E-MAIL OF FRIEND",
        name="email",
        v-model="email",
        :disabled="sending",
        :validators="[valid.email]",
        required
      )
      .buttons
        w-button.ma1(@click="showDialog = false", text, shadow, md) CANCEL
        w-button.ma1(type="submit", shadow, md, bg-color="success") INVITE
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Form from "@/mixins/Form";
export default {
  mixins: [Form],
  name: "ListShare",
  data: () => ({
    email: "",
    role: "user",
    showDialog: false,
  }),
  computed: {
    ...mapGetters(["lists"]),
    listId() {
      return this.$route.params.id;
    },
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
  },
  created() {
    bus.$on("shareList", (data) => {
      this.showDialog = true;
    });
  },
  methods: {
    ...mapActions(["inviteList"]),
    async submit() {
      this.inviteList({
        listId: this.listId,
        email: this.email,
        role: this.role,
      })
        .then(() => {
          this.showDialog = false;
        })
        .catch((err) => {
          console.log(err);
          switch (err.status) {
            default:
              this.status = "idle";
              this.showError(err);
              break;
          }
        });
    },
  },
};
</script>
<style scoped>
.modal.shareForm {
  width: 400px;
  height: 170px;
  margin-left: -200px;
  margin-top: -85px;
  animation-name: growDeleteForm;
  animation-duration: 0.1s;
}
@keyframes growDeleteForm {
  from {
    width: 0px;
    height: 0px;
    margin-left: 0px;
    margin-top: 0px;
  }
  to {
    height: 170px;
    width: 400px;
    margin-left: -200px;
    margin-top: -85px;
  }
}
.modal.shareForm {
  width: 400px;
  height: 300px;
  margin-left: -200px;
  margin-top: -150px;
  animation-name: growDeleteForm;
  animation-duration: 0.1s;
}
@keyframes growDeleteForm {
  from {
    width: 0px;
    height: 0px;
    margin-left: 0px;
    margin-top: 0px;
  }
  to {
    height: 30px;
    width: 400px;
    margin-left: -200px;
    margin-top: -150px;
  }
}
.modal input {
  padding: 0.5em;
  display: block;
  font-size: 1em;
  width: 75%;
  margin: auto;
}
</style>>
