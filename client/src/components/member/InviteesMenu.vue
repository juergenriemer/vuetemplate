<template>
  <ion-list lines="none" @click="action">
    <menu-item
      label="Withdraw Invitation"
      :icon="informationCircle"
      data="uninvite"
    />
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import { trash } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action"],
  components: {
    MenuItem,
    IonList,
  },
  data() {
    return {
      trash,
    };
  },
};
</script>
