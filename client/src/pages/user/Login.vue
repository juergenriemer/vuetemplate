<template lang="pug">
base-layout(page-title="Login")
  template(v-slot:title)
    avatar(size="large", list-title="Listle")
  template(v-slot:content)
    .ion-padding
      form(v-if="!showInfoSheet", @submit.prevent="validate", novalidate)
        ion-list
          ion-item
            ion-label(position="floating") E-Mail
            ion-input(
              name="email",
              type="email",
              v-model="form.email",
              rules="required,email",
              :disabled="disabled"
            )
          form-error(:error="errors.email")
          ion-item
            ion-label(position="floating") Password
            ion-input(
              name="password",
              type="text",
              v-model="form.password",
              rules="password",
              :disabled="disabled"
            )
          form-error(:error="errors.password")
        ion-button(type="submit", expand="block", :disabled="disabled") LOGIN
        button.hide(type="submit", :disabled="disabled")

      info-sheet(type="error", v-if="status == 'wrong-creds'")
        template(v-slot:content)
          p
            | Wrong e-mail or password.
          p
            | Please try again or if you are having troubles logging consider to reset your password.
          a(href="/user/login", @click="status = 'idle'")
            | Try again
          p
            a(href="/user/reset-password")
            | Reset your password
          p
            a(href="/user/register")
            | Register a new account

      info-sheet(type="error", v-if="status == 'in-registration'")
        template(v-slot:content)
          p
            | The account exists already but was not yet verified.
          p
            | In case you did not receive an e-mail we can send it again.
            a(href="/user/resend-verification")
            | Resend registration verification

      info-sheet(type="error", v-if="status == 'login-locked'")
        template(v-slot:content)
          p
            | You exeeded the maximum amount of tries.
          p
            | Please wait a minute and try again or request a new password.
            a(href="/user/login", @click="status = 'idle'")
            | Try again
          p
            a(href="/user/reset-password")
            | Request a new password

      info-sheet(type="success", v-if="status == 'OK'")
        template(v-slot:content)
          p
            | Login successful
          p
            | Redirecting...
</template>
<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import FormError from "@/components/base/FormError.vue";
import InfoSheet from "@/components/base/InfoSheet.vue";
import Form from "@/mixins/Form";

export default {
  mixins: [Form],
  components: {
    InfoSheet,
    FormError,
    Avatar,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
  },
  data: () => ({
    showInfoSheet: false,
    showIntro: true,
    form: {
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
    },
  }),
  computed: {
    sending() {
      return this.status == "sending";
    },
  },
  mounted() {
    //  this.showIntro = this.firstTimer;
  },
  methods: {
    toLogin() {
      this.showIntro = false;
    },
    toRegister() {
      self.location.href = "/register";
    },
    toOffline() {
      this.offlineUser();
      setTimeout(() => {
        this.$root.$router.push({
          path: `/app/list`,
        });
      }, 1500);
    },
    async submit() {
      this.status = "submitting";
      this.$store
        .dispatch("login", this.form)
        .then(() => {
          this.status = "OK";
          this.showInfoSheet = true;
          setTimeout(() => {
            this.$root.$router.push({
              path: `/app/list`,
            });
          }, 500);
        })
        .catch((err) => {
          this.showInfoSheet = true;
          switch (err.status) {
            case 422:
              this.status = err.message;
              break;
            default:
              this.status = "idle";
              this.showInfoSheet(err);
              break;
          }
        });
    },
  },
};
</script>
<style>
#first-time li {
  font-size: 0.8em;
}
</style>
