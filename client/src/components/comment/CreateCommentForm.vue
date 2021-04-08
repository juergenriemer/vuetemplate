<template>
  <form
    style="background: goldenrod"
    id="bottom-input"
    class="ion-padding"
    @submit.prevent="submit"
  >
    {{ form.text }}
    <ion-toolbar style="--background: goldenrod">
      <bottom-input
        placeholder="NEW COMMENT"
        autofocus="true"
        expandTo="80"
        @input="input"
      ></bottom-input>
      <ion-buttons slot="end">
        <ion-button @click="stopCommenting">
          <ion-icon :icon="close" size="medium"></ion-icon>
        </ion-button>
        <ion-button @click="takePicture">
          <ion-icon :icon="camera" size="medium"></ion-icon>
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
import BottomInput from "@/components/base/Input.vue";
import Data from "@/mixins/Data";
import User from "@/mixins/User";

import { camera, send, close } from "ionicons/icons";
export default {
  emits: ["change-mode"],
  mixins: [Data, User],
  props: ["itemInCommentMode"],
  components: {
    BottomInput,
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
        text: "",
      },
    };
  },
  computed: {
    saveDisabled() {
      return !this.form.text;
    },
  },
  methods: {
    stopCommenting() {
      this.$emit("change-mode", "create");
    },
    takePicture() {
      alert("not implemented");
    },
    input(data) {
      this.form.text = data;
    },
    submit() {
      let item = Object.assign(
        { _id: this.objectId(), creatorId: this.myId() },
        this.form
      );
      this.$store
        .dispatch("addComment", {
          listId: this.listId(),
          itemId: this.itemInCommentMode._id,
          comment: item,
        })
        .then(() => {
          this.form.text = "";
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
