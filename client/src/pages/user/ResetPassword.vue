<template lang="pug">
base-layout(page-title="Reset Password")
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
          ion-item
            ion-label(position="floating") Retype Password
            ion-input(
              name="retypedPassword",
              type="text",
              v-model="form.retypedPassword",
              rules="equal:password",
              :disabled="disabled"
            )
          form-error(:error="errors.retypedPassword")
        ion-button(type="submit", expand="block", :disabled="disabled") RESET
        button.hide(type="submit", :disabled="disabled")

      info-sheet(type="error", v-if="status == 'no-user'")
        template(v-slot:content)
          p
            | The account does not exist.
          p
            | Check your e-mail or create a new account.
          a(href="/user/register")
            | Register an account
      info-sheet(type="error", v-if="status == 'in-registration'")
        template(v-slot:content)
          p
            | The account exists already but was not yet verified.
          p
            | In case you did not receive an e-mail we can send it again.
          a(href="/user/resend-verification")
            | Resend registration verification
      info-sheet(type="success", v-if="status == 'OK'")
        template(v-slot:content)
          p
            | Your request to change the password was successful.
          p
            | Please check your mailbox for a verification e-mail.
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
    form: {
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
      retypedPassword: "Test!234",
    },
  }),
  methods: {
    async submit() {
      this.status = "sending";
      setTimeout(() => {
        this.$store
          .dispatch("resetPassword", this.form)
          .then(() => {
            this.showInfoSheet = true;
            this.status = "OK";
          })
          .catch((err) => {
            this.showInfoSheet = true;
            switch (err.status) {
              case 400:
                // invalid fields (server side)
                this.status = "idle";
                this.showError(err.message);
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
