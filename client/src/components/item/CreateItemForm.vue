<template>
  <form
    ref="form"
    id="bottom-input"
    class="ion-padding"
    @submit.prevent="validate"
  >
    <ion-toolbar>
      <ion-input
        hasFocus
        placeholder="NEW ITEM"
        name="title"
        v-model="title"
        type="text"
        rules="required"
      ></ion-input>
      <ion-buttons slot="end">
        <ion-button @click="stopCreating">
          <ion-icon :icon="close" size="medium"></ion-icon>
        </ion-button>
        <ion-button :disabled="sendDisabled" type="submit">
          <ion-icon :icon="send" size="medium"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </form>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";

import { camera, send, close } from "ionicons/icons";
import Form from "@/mixins/Form";
import Data from "@/mixins/Data";
export default {
  props: ["listId"],
  emits: ["save-item"],
  mixins: [Form, Data],
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      submitting: false,
      input: null,
      camera,
      send,
      close,
      title: "",
    };
  },
  computed: {
    sendDisabled() {
      return this.disabled || !this.title;
    },
  },
  methods: {
    stopCreating() {
      this.input.value = "";
      this.input.blur();
    },
    async submit() {

      const creatorId = this.$store.getters.user.userId;
      let item = Object.assign(
        { _id: this.objectId(), createdAt: new Date(), creatorId, comments: [] },
        this.form
      );
      return this.$store
        .dispatch("addItem", { listId: this.listId, item })
        .then((res) => {
          this.resetForm();
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);
        })
        .catch((err) => {
          this.showError(err);
        })
        .finally(() => {
          this.resetForm();
          this.formFocus();
        });
    },
  },
};
</script>
