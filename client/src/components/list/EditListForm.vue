<template>
  <form ref="form" class="ion-padding" @submit.prevent="validate">
    <ion-list>
      <ion-item>
        <ion-label position="floating">Title</ion-label>
        <ion-input
          name="title"
          type="text"
          v-model="list.title"
          rules="required"
        />
      </ion-item>
      <form-error :error="errors.title"></form-error>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-textarea
          name="description"
          rows="5"
          v-model="list.description"
        ></ion-textarea>
      </ion-item>
    </ion-list>
    <ion-button :disabled="disabled" type="submit" expand="block"
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
  props: ["list"],
  mixins: [Form],
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
      const list = Object.assign(this.list, this.form);
      return this.$store
        .dispatch("updateList", { listId: list._id, list })
        .then(() => {
          this.nav(`/app/items/${this.list._id}`);
        })
        .catch((err) => this.showError(err));
    },
  },
};
</script>
