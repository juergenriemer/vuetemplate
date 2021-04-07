<template>
  <form id="bottom-input" class="ion-padding" @submit.prevent="submit">
    <ion-toolbar>
      <bottom-input
        placeholder="NEW COMMENT"
        autofocus="true"
        expandTo="180"
        value="asdf qwer"
        @input="input"
      ></bottom-input>
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
import BottomInput from "@/components/base/Input.vue";

import { camera, send, close } from "ionicons/icons";
export default {
  emits: ["create-item"],
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
  mounted() {
    if (self.isWeb) {
      // we only want to have auto focus in web, in mobile it would
      // load the keyboard everytime we enter a list
      this.setFocus();
    }
  },
  watch: {
    "$route.params.listId": function () {
      //this.setFocus();
    },
  },
  methods: {
    input(data) {
      this.form.text = data;
    },
    setFocus() {
      setTimeout(() => {
        const input = this.$el.querySelector("input");
        input.focus();
      }, 500);
    },
    submit() {
      console.log("doit");
      this.$emit("create-item", this.form);
      return;
      if (!this.comment.text) return;
      let comment = Object.assign(
        { _id: this.objectId(), creatorId: this.myUserId },
        this.comment
      );

      //let item = Object.assign({ _id: Math.random() }, this.form);

      this.addComment({
        listId: this.listId,
        itemId: this.itemId,
        comment: this.form,
      })
        .then(() => {
          this.form.text = "";
          //this.$el.querySelector("input").focus();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
