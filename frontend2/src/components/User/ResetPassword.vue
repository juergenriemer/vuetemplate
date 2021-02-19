<template lang="pug">
#user.row
  .left.column
    .form
      h3 Reset your password
      w-form(novalidate, v-if="status != 'OK'", @validate="validate")
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
        w-button.ma1(
          bg-color="primary",
          color="white",
          lg,
          :disabled="sending",
          :loading="sending",
          type="submit"
        ) RESET
      .result(v-if="status !== 'no-account'")
        p
          | The account exists already.
        p
          | To create a new account click on the button below.
        a(href="#/register")
          | Register an account
      .result(v-if="status == 'OK'")
        p
          | Your password reset was successful.
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
                console.warn(err.message);
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
