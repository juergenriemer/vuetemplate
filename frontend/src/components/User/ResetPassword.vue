<template lang="pug">
#single
  .single.column
    .form
      h3 Reset your password
      w-form(novalidate, v-if="active", @validate="validate")
        w-input#email.mb4(
          label="E-MAIL",
          name="email",
          inputmode="email",
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
      .w-flex.result(v-if="status == 'no-user'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The account does not exist.
          p
            | Check your e-mail or create a new account.
          a(href="#/register")
            | Register an account
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
            | Your request to change the password was successful.
          p
            | Please check your mailbox for a verification e-mail.
</template>
<script>
import { mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "ResetPassword",
  mixins: [Form],
  data: () => ({
    user: {
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
    },
  }),
  methods: {
    ...mapActions(["resetPassword"]),
    async submit() {
      this.status = "sending";
      setTimeout(() => {
        this.resetPassword(this.user)
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
