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
      <ion-buttons class="hidden-buttons" slot="start" v-if="hiddenItems">
        <ion-button v-if="itemShowMode" @click="$emit('toggleItemShowMode')">
          <ion-icon :icon="eyeOff"></ion-icon>
        </ion-button>
        <ion-button v-else @click="$emit('toggleItemShowMode')">
          <ion-icon :icon="eye"></ion-icon>
        </ion-button>
      </ion-buttons>
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

import { camera, send, close, eye, eyeOff } from "ionicons/icons";
import Form from "@/mixins/Form";
import Data from "@/mixins/Data";
export default {
  props: ["list", "itemShowMode", "hiddenItems"],
  emits: ["duplicate","toggleItemShowMode"],
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
      eye,
      eyeOff,
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
    preventDuplicate() {
      if( this.list.uniqueItems ){
        const duplicate = this.list.items.find( itm => itm.title.trim() == this.form.title.trim() );
        if( duplicate ){
          if( duplicate.done ) {
            console.log( 'update')
            duplicate.done = false;
            this.$store
              .dispatch("updateItem", {
                listId: this.list._id,
                itemId: duplicate._id,
                item: duplicate
              })
              .catch((err) => {
                this.showError(err);
              });
          }
          else {
            this.$emit( "duplicate");
          }
          return true;
        }
      }
      return false;
    },
    submit() {
      Promise.resolve()
        .then( ()=>{
          if( ! this.preventDuplicate() ) {
            const creatorId = this.$store.getters.user.userId;
            let item = Object.assign(
              { _id: this.objectId(), createdAt: new Date(), creatorId, comments: [] },
              this.form
            );
            return this.$store
              .dispatch("addItem", { listId: this.list._id, item })
              .then((res) => {
                this.resetForm();
                setTimeout(() => {
                  this.scrollToBottom("ItemsPage");
                }, 0);
              } );
          }
          else return true;
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
<style>
.hidden-buttons ion-button {
  --padding-start:0px;
}
</style>
