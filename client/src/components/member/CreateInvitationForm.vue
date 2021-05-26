<template>
  <ion-list-header>Invite a friend</ion-list-header>
  <form ref="form" class="ion-padding" @submit.prevent="validate" novalidate>
    <ion-item>
      <ion-label position="floating">Email of friend</ion-label>
      <ion-input hasFocus type="text" :disabled="disabled" rules="email" name="email" />
    </ion-item>
    <form-error :error="errors.email"></form-error>
    <ion-button aria-label="invite-friend" type="submit" :disabled="disabled" expand="block"
      >INVITE</ion-button
    >
  </form>
</template>

<script>
import {
  IonListHeader,
  IonList,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/vue";

import FormError from "@/components/base/FormError.vue";
import Form from "@/mixins/Form";

export default {
  emits: ["invite"],
  props: ["listId", "error"],
  mixins: [Form],
  components: {
    FormError,
    IonListHeader,
    IonList,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  },
  methods: {
    submit() {
      const serverErrors = {
        "user-already-member": "This user is already a member.",
        "user-already-invited": "This user is already invited.",
      };
      return this.$store
        .dispatch("invite", {
          listId: this.listId,
          email: this.form.email,
          role: "user",
        })
        .then( ()=>{
          this.resetForm();
          this.formFocus()
        })
        .catch((err) => {
          if (err.message && serverErrors[err.message]) {
            this.errors.email = serverErrors[err.message];
          } else this.showError(err);
        });
    },
  },
};
</script>
