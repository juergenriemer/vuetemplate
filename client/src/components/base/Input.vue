<template>
  <div id="input">
    <div class="wrapper">
      <div class="image" v-show="imageFile">
        <ion-icon
          class="remove"
          @click="imageFile = null"
          icon="close"
          size="small"
        ></ion-icon>
        <img ref="thumb" class="thumb" />
      </div>
      <div
        class="content"
        @focus="onFocus"
        @blur="onBlur"
        contenteditable="true"
        @input="expand($event)"
        @keydown="onKeydown($event)"
        @click="onClick($event)"
      >
         value 
      </div>
    </div>
  </div>
</template>
<script>
import { IonButtons, IonButton, IonIcon } from "@ionic/vue";
export default {
  emits: ["input"],
  props: [
    "expandTo",
    "placeholder",
    "imageFile",
    "value",
    "autofocus",
    "maxlength",
    "background",
    "blank",
  ],
  components: {
    IonButtons,
    IonButton,
    IonIcon,
  },
};
</script>
