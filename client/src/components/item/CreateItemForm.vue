<template>
  <form class="ion-padding" @submit.prevent="submit">
    <ion-toolbar>
      <ion-input
        placeholder="NEW ITEM"
        v-model="form.title"
        clear-input
      ></ion-input>
      <ion-buttons slot="end">
        <ion-button :disabled="saveDisabled" @click="submit">
          <ion-icon rules="required" :icon="send" size="medium"></ion-icon>
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
export default {
  emits: ["save-item"],
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
      camera,
      send,
      close,
      form: {
        title: "",
      },
    };
  },
  computed: {
    saveDisabled() {
      return !this.form.title;
    },
  },
  mounted() {
    this.setFocus();
  },
  watch: {
    "$route.params.listId": function () {
      this.setFocus();
    },
  },
  methods: {
    setFocus() {
      setTimeout(() => {
        const input = this.$el.querySelector("input");
        input.focus();
      }, 500);
    },
    submit() {
      // REF: create ObjectID method
      let item = Object.assign({ _id: Math.random() }, this.form);
      this.$emit("save-item", item);
      setTimeout(() => {
        this.form.title = "";
      }, 0);
    },
  },
};
</script>
