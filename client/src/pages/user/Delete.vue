<template lang="pug">
base-layout(page-title="Delete Account")
  template(v-slot:title)
    avatar(size="large", list-title="Listle")
  template(v-slot:content)
    .ion-padding
      p Note that if you delete your account all your lists will get deleted. They can not be recovered at a later stage.
      form(ref="form", v-if="!showInfoSheet", @submit.prevent="validate", novalidate)
        ion-list
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
        ion-button(type="submit", expand="block", :disabled="disabled") LOGIN
        button.hide(type="submit", :disabled="disabled")


      info-sheet(type="error", v-if="status == 'wrong-creds'")
        template(v-slot:content)
          p
            | Wrong e-mail or password.
          p
            | Please try again or if you are having troubles logging consider to reset your password.
          p 
            a(href="/user/delete", @click="status = 'idle'") Try again
          p
            a(href="/user/reset-password") Reset your password

      info-sheet(type="success", v-if="status == 'OK'")
        template(v-slot:content)
          p
            | Your deletion request was successful.
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
        .dispatch("deleteUser", this.form)
        .then(() => {
          this.showInfoSheet = true;
          this.status = "OK";
        })
        .catch((err) => {
          switch (err.status) {
            case 422:
              console.log( err.message )
              this.showInfoSheet = true;
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
