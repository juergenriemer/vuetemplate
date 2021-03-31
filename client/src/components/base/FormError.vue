<template>
  <div v-if="error" class="form-error">
    <div class="icon">
      <ion-icon :icon="alertCircle" size="small"></ion-icon>
    </div>
    <div class="message">{{ error }}</div>
  </div>
</template>
<script>
import { IonIcon } from "@ionic/vue";
import { alertCircle } from "ionicons/icons";

export default {
  props: ["error"],
  data() {
    return { alertCircle };
  },
  components: {
    IonIcon,
  },
};
</script>
<style>
.form-error {
  padding-top: 5px;
  display: flex;
  color: red;
}

.form-error .icon {
  zoom: 0.85;
}
.form-error .message {
  padding-left: 2px;
  font-size: 0.8em;
}
</style>
