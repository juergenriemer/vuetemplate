<template>
  <form class="ion-padding" @submit.prevent="submitForm">
    <input type="text" placeholder="NEW ITEM" required v-model="item.title" />
  </form>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
} from "@ionic/vue";

export default {
  emits: ["save-memory"],
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      item: {
        title: "",
      },
    };
  },
  methods: {
    submitForm() {
      let item = Object.assign({ _id: 123 }, this.item);
      this.$emit("save-item", item);
      setTimeout(() => {
        this.item.title = "";
      }, 0);
    },
  },
};
</script>
