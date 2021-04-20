<template>
  <form
    ref="form"
    id="bottom-input"
    class="ion-padding"
    @submit.prevent="validate"
  >
    <ion-toolbar>
      <ion-input
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
  watch: {
    "$route.params.listId": function () {
      this.setFocus();
    },
  },
  methods: {
    stopCreating() {
      this.input.value = "";
      this.input.blur();
    },
    setFocus() {
      let input = this.$el.querySelector("input");
      input.value = "";
      input.focus();
    },
    async submit() {
      let item = Object.assign(
        { _id: this.objectId(), comments: [] },
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
          this.setFocus();
        });
    },
  },
};
</script>
