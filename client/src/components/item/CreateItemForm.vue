<template>
  <form id="bottom-input" class="ion-padding" @submit.prevent="submit">
    <ion-toolbar>
      <ion-input placeholder="NEW ITEM" v-model="form.title"></ion-input>
      <ion-buttons slot="end">
        <ion-button @click="stopCreating">
          <ion-icon :icon="close" size="medium"></ion-icon>
        </ion-button>
        <ion-button :disabled="saveDisabled" @click="submit">
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
import Data from "@/mixins/Data";
export default {
  emits: ["save-item"],
  mixins: [Data],
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
      input: null,
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
      this.$store
        .dispatch("addItem", { listId: this.listId(), item })
        .then((res) => {
          this.setFocus();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
