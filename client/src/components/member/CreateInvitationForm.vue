<template>
  <ion-list-header>Invite a friend</ion-list-header>
  <form class="ion-padding" @submit.prevent="validate" novalidate>
    <ion-item>
      <ion-label position="floating">Email of friend</ion-label>
      <ion-input type="text" required v-model="invitation.email" />
    </ion-item>
    <form-error :error="error"></form-error>
    <ion-button type="validate" expand="block">INVITE</ion-button>
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
  mixins: [Form],
  props: ["error"],
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
  data() {
    return {
      invitation: {
        email: "mordret@sms.at",
      },
    };
  },
  methods: {
    submit() {
      console.log("ooo");
      this.$emit("invite", this.invitation.email);
    },
  },
};
</script>
