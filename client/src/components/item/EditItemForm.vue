<template>
  <form id="bottom-input" class="ion-padding" @submit.prevent="submit">
    <ion-toolbar>
      <ion-input placeholder="EDIT ITEM" v-model="form.title"></ion-input>
      <ion-buttons slot="end">
        <ion-button @click="stopEditing">
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

import { send, close } from "ionicons/icons";
export default {
  props: ["form"],
  emits: ["update-item", "change-mode"],
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
      send,
      close,
      origTitle: "",
    };
  },
  computed: {
    saveDisabled() {
      return !this.form.title || this.form.title == this.origTitle;
    },
  },
  mounted() {
    this.$el.addEventListener("keyup", (evt) => {
      if (evt.key == "Escape") this.stopEditing();
    });
    this.origTitle = this.form.title;
    setTimeout(() => {
      const input = this.$el.querySelector("input");
      input.focus();
    }, 800);
  },
  methods: {
    stopEditing() {
      this.form.title = this.origTitle;
      this.$emit("change-mode", "create");
    },
    submit() {
      let item = Object.assign({}, this.form);
      this.$store
        .dispatch("updateItem", {
          listId: this.listId(),
          itemId: item._id,
          item,
        })
        .then((res) => {
          this.origTitle = this.form.title;
          this.stopEditing();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
