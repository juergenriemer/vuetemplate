<template lang="pug">
#single
  .single.column
    .form
      h3 Login
      w-form(novalidate, v-if="active", @validate="validate")
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
          ) LOGIN
      .w-flex.result(v-if="status == 'wrong-creds'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | Wrong e-mail or password.
          p
            | Please try again or if you are having troubles logging consider to reset your password.
          a(href="#/login", @click="status = 'idle'")
            | Try again
          p
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
      .w-flex.result(v-if="status == 'login-locked'")
        i.error.bounce.fas.fa-exclamation-triangle
        div
          p
            | You exeeded the maximum amount of tries.
          p
            | Please wait a minute and try again or request a new password.
          a(href="#/login", @click="status = 'idle'")
            | Try again
          p
          a(href="#/reset-password")
            | Request a new password
      .w-flex.result(v-if="status == 'OK'")
        i.success.bounce.fas.fa-check
        div
          p
            | Login successful
          p
            | Redirect....
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Form from "@/mixins/Form";
export default {
  name: "Login",
  mixins: [Form],
  data: () => ({
    user: {
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
    },
  }),
  //computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["login"]),
    async submit() {
      this.status = "sending";
      this.login(this.user)
        .then(() => {
          this.status = "OK";
          setTimeout(() => {
            this.$root.$router.push({
              path: `/main`,
            });
          }, 500);
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
  },
};
</script>
