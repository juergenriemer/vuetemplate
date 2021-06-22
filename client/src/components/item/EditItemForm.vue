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
        name="title"
        placeholder="EDIT ITEM"
        rules="required"
        :value="itemInEditMode.title"
      ></ion-input>
      <ion-buttons slot="start" v-if="hiddenItems">
        <ion-button v-if="itemShowMode" @click="$emit('toggleItemShowMode')">
          <ion-icon :icon="eyeOff"></ion-icon>
        </ion-button>
        <ion-button v-else @click="$emit('toggleItemShowMode')">
          <ion-icon :icon="eye"></ion-icon>
        </ion-button>
      </ion-buttons>
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
import { send, close, eye, eyeOff } from "ionicons/icons";
export default {
  mixins: [Form],
  props: ["list", "itemInEditMode", "hiddenItems", "itemShowMode"],
  emits: ["change-mode", "duplicate", "toggleItemShowMode"],
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
      eye,
      eyeOff,
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
    preventDuplicate() {
      if( this.list.uniqueItems ){
        const duplicate = this.list.items.find( itm => itm.title.trim() == this.form.title.trim() );
        if( duplicate ){
          this.$emit( "duplicate");
          return true;
        }
      }
      return false;
    },
    submit() {
      if( this.preventDuplicate() ) {
          this.sending = false;
          this.formFocus();
          return;
      }
      let item = Object.assign(this.itemInEditMode, this.form);
      return this.$store
        .dispatch("updateItem", {
          listId: this.list._id,
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
    }
  }
};
</script>
