<template lang="pug">
#user.row
  .left.column
    .form
      h3 Register an account
      w-form(novalidate, v-if="active", @validate="validate")
        w-input#firstName.mb4(
          label="FIRST NAME",
          name="firstName",
          v-model="user.firstName",
          :disabled="sending",
          :validators="[valid.firstName]",
          required
        )
        w-input#lastName.mb4(
          label="LAST NAME",
          name="lastName",
          v-model="user.lastName",
          :disabled="sending",
          :validators="[valid.lastName]",
          required
        )
        w-input#email.mb4(
          label="E-MAIL",
          name="email",
          v-model="user.email",
          :disabled="sending",
          :validators="[valid.email]",
          required
        )
        w-input#password.mb4(
          label="PASSWORD",
          name="password",
          v-model="user.password",
          :disabled="sending",
          :validators="[valid.password]",
          required
        )
        .buttons
          w-button.ma1(
            bg-color="primary",
            color="white",
            shadow,
            md,
            :disabled="sending",
            :loading="sending",
            type="submit"
          ) REGISTER
      .w-flex.result(v-if="status == 'is-registered'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The account exists already.
          p
            | If you are having troubles logging please try to reset your password.
          a(href="#/reset-password")
            | Reset your password
      .w-flex.result(v-if="status == 'in-registration'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The account exists already but was not yet verified.
          p
            | In case you did not receive an e-mail we can send it again.
          a(href="#/resend-verification")
            | Resend registration verification
      .w-flex.result(v-if="status == 'OK'")
        i.success.bounce.fas.fa-check
        div
          p
            | Your registration was successful.
          p
            | Please check your mailbox for a verification e-mail.
</template>
<script>
import { mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "Register",
  mixins: [Form],
  data: () => ({
    user: {
      firstName: "Juergen",
      lastName: "Riemer",
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
    },
  }),
  methods: {
    ...mapActions(["registerUser"]),
    async submit() {
      this.status = "sending";
      setTimeout(() => {
        this.registerUser(this.user)
          .then(() => {
            this.status = "OK";
          })
          .catch((err) => {
            switch (err.status) {
              case 400:
                this.status = "idle";
                break;
              case 422:
                this.status = err.message;
                break;
              default:
                this.status = "idle";
                this.showError(err);
                break;
            }
          });
      }, 500);
    },
  },
};
</script>
