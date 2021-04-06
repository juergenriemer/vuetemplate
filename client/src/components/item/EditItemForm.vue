<template>
  <form id="bottom-input" class="ion-padding" @submit.prevent="submit">
    <ion-toolbar>
      <ion-input
        placeholder="EDIT ITEM"
        v-model="form.title"
        ref="inputField"
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

import { camera, send } from "ionicons/icons";
export default {
  props: ["form"],
  emits: ["update-item", "stop-editing"],
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
      origTitle: "",
    };
  },
  computed: {
    saveDisabled() {
      return !this.form.title || this.form.title == this.origTitle;
    },
  },
  mounted() {
    this.$el.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      let close = evt.target.querySelector("[aria-label='reset']");
      if (close) this.stopEditing();
    });
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
      this.$emit("stop-editing");
    },
    submit() {
      let item = Object.assign({}, this.form);
      this.$emit("update-item", item);
    },
  },
};
</script>
