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
import Data from "@/mixins/Data";
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
  mixins: [Form, Data],
  emits: ["save-list"],
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
    return {
      form: {
        title: "",
        description: "",
      },
    };
  },
  methods: {
    submit() {
      // add additional info for offline usage, this data will get changed
      // and/or filled by the server, hence a second update mutation info
      // vuex store
      const creator = Object.assign(
        { role: "owner" },
        this.$store.getters.user
      );
      let list = Object.assign(
        { _id: this.objectId(), users: [creator] },
        this.form
      );
      this.$emit("save-list", list);
    },
  },
};
</script>
