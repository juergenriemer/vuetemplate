<template>
  <form class="ion-padding" @submit.prevent="validate">
    <ion-list>
      <ion-item>
        <ion-label position="floating">Title</ion-label>
        <ion-input
          name="title"
          type="text"
          v-model="form.title"
          rules="required"
        />
      </ion-item>
      <form-error :error="errors.title"></form-error>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-textarea
          name="description"
          rows="5"
          v-model="form.description"
        ></ion-textarea>
      </ion-item>
    </ion-list>
    <ion-button :disabled="submitting" type="submit" expand="block"
      >Save</ion-button
    >
  </form>
</template>

<script>
import FormError from "@/components/base/FormError.vue";
import Form from "@/mixins/Form";
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
  props: ["form"],
  mixins: [Form],
  emits: ["update-list"],
  components: {
    FormError,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
  },
  data() {
    return {};
  },
  methods: {
    submit() {
      this.$emit("update-list", this.form);
    },
  },
};
</script>
