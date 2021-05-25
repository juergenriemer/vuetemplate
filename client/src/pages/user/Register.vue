<template lang="pug">
base-layout(page-title="Register", page-id="Register")
  template(v-slot:title)
    avatar(size="large", list-title="Listle")
  template(v-slot:content)
    .ion-padding
      form(ref="form", v-if="!showInfoSheet", @submit.prevent="validate", novalidate)
        ion-list
          ion-item
            ion-label(position="floating") First Name
            ion-input(
              name="firstName",
              type="text",
              rules="required",
              :disabled="disabled"
            )
          form-error(:error="errors.firstName",for="firstName")
          ion-item
            ion-label(position="floating") Last Name
            ion-input(
              name="lastName",
              type="text",
              rules="required",
              :disabled="disabled"
            )
          form-error(:error="errors.lastName",for="lastName")
          ion-item
            ion-label(position="floating") E-Mail
            ion-input(
              name="email",
              type="email",
              rules="required,email",
              :disabled="disabled"
            )
          form-error(:error="errors.email",for="email")
          ion-item
            ion-label(position="floating") Password
            ion-input(
              name="password",
              type="text",
              rules="required,password",
              :disabled="disabled"
            )
          form-error(for="password", :error="errors.password")
          ion-item
            ion-label(position="floating") Retype Password
            ion-input(
              name="retypedPassword",
              type="text",
              rules="required,equal:password",
              :disabled="disabled"
            )
          form-error(:error="errors.retypedPassword",for="retypedPassword")
        ion-button(type="submit", expand="block", :disabled="disabled") LOGIN
        button.hide(type="submit", :disabled="disabled")

      info-sheet(type="error", v-if="status == 'is-registered'")
        template(v-slot:content)
          p
            | The account exists already.
          p
            | If you are having troubles logging please try to reset your password.
          a(href="/user/reset-password")
            | Reset your password
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
            | Your registration was successful.
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
  }),
  mounted() {
    return;
    const form = {
      firstName: "Juergen",
      lastName: "Riemer",
      email: "juergen.riemer@gmail.com",
      password: "Test!234",
      retypedPassword: "Test!234",
    }
    setTimeout( ()=>{
    for( var field in form ){
      document.querySelector( "[name='"+ field +"']").value = form[field]
    }

    }, 500)
  }
  ,
  methods: {
    async submit() {
      return this.$store
        .dispatch("registerUser", this.form)
        .then(() => {
          this.showInfoSheet = true;
          this.status = "OK";
        })
        .catch((err) => {
          switch (err.status) {
            case 422:
              this.showInfoSheet = true;
              console.log(err.message);
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
