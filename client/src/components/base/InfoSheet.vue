<template>
  <div class="info-sheet">
    <div class="icon" :class="color">
      <ion-icon :icon="icon" size="large"></ion-icon>
    </div>
    <div class="message">
      <slot name="content" />
    </div>
  </div>
</template>
<script>
import { IonIcon } from "@ionic/vue";
import { checkmarkCircle, alertCircle } from "ionicons/icons";

export default {
  props: ["type"],
  data() {
    return {
      alertCircle,
      checkmarkCircle,
      icons: {
        success: [checkmarkCircle, "green"],
        error: [alertCircle, "red"],
      },
    };
  },
  components: {
    IonIcon,
  },
  computed: {
    icon() {
      return this.icons[this.type][0];
    },
    color() {
      return this.icons[this.type][1];
    },
  },
};
</script>
<style>
.red {
  color: red;
}
.green {
  color: green;
}
.info-sheet {
  padding-top: 5px;
  display: flex;
  align-items: start;
}

.info-sheet a,
.info-sheet p {
  font-size: 1.3em;
  margin: 0;
  margin-bottom: 10px;
}

.info-sheet .icon {
  font-weight: bold;
}
.info-sheet .message {
  padding-left: 10px;
  font-size: 0.8em;
}
</style>
