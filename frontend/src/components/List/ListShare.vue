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
        inputmode="email",
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
    ...mapActions(["invite"]),
    async submit() {
      this.invite({
        listId: this.listId,
        email: this.email,
        role: this.role,
      })
        .then(() => {
          console.log("!!!!!!!!!!!");
          this.showDialog = false;
        })
        .catch((err) => {
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
