<template lang="pug">
#user.row
  .left.column
    .form
      h3 Reset your password
      w-form(novalidate, v-if="active", @validate="validate")
        w-input#email.mb4(
          label="E-MAIL",
          name="email",
          v-model="user.email",
          :disabled="sending",
          :validators="[valid.email]",
          required
        )
        w-button.ma1(
          bg-color="primary",
          color="white",
          lg,
          :disabled="sending",
          :loading="sending",
          type="submit"
        ) RESEND VERIFICATION
      .w-flex.result(v-if="status == 'no-account'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | The account does not exist.
          p
            | To create a new account click on the link below.
          a(href="#/register")
            | Register an account
      .w-flex.result(v-if="status == 'OK'")
        i.success.bounce.fas.fa-check
        div
          p
            | Resending the verification e-mail was successful.
          p
            | Please check your mailbox.
</template>
<script>
import { mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "RegisterVerifyResend",
  mixins: [Form],
  data: () => ({
    user: {
      email: "juergen.riemer@gmail.com",
    },
  }),
  methods: {
    ...mapActions(["registerVerifyResend"]),
    async submit() {
      this.status = "sending";
      setTimeout(() => {
        this.registerVerifyResend(this.user)
          .then(() => {
            this.status = "OK";
          })
          .catch((err) => {
            switch (err.status) {
              case 400:
                this.status = "idle";
                this.showError(err);
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
