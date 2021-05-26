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
        placeholder="EDIT ITEM"
        rules="required"
        v-model="itemInEditMode.title"
      ></ion-input>
      <ion-buttons slot="end">
        <ion-button aria-label="close-edit" @click="stopEditing">
          <ion-icon :icon="close" size="medium"></ion-icon>
        </ion-button>
        <ion-button :disabled="sendDisabled" @click="submit">
          <ion-icon aria-label="save-edit" :icon="send" size="medium"></ion-icon>
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

import Form from "@/mixins/Form";
import { send, close } from "ionicons/icons";
export default {
  mixins: [Form],
  props: ["listId", "itemInEditMode"],
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
    sendDisabled() {
      return (
        this.disabled ||
        !this.itemInEditMode.title ||
        this.itemInEditMode.title == this.origTitle
      );
    },
  },
  mounted() {
    this.$el.addEventListener("keyup", (evt) => {
      if (evt.key == "Escape") this.stopEditing();
    });
    this.origTitle = this.itemInEditMode.title;
  },
  methods: {
    stopEditing() {
      this.itemInEditMode.title = this.origTitle;
      this.$emit("change-mode", "create");
    },
    submit() {
      let item = Object.assign(this.itemInEditMode, this.form);
      return this.$store
        .dispatch("updateItem", {
          listId: this.listId,
          itemId: item._id,
          item,
        })
        .then((res) => {
          this.origTitle = this.itemInEditMode.title;
          this.stopEditing();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
