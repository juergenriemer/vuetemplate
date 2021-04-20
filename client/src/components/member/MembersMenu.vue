<template>
  <ion-list lines="none" @click="action">
    <menu-item
      v-if="data.item.role == 'user'"
      label="Make Adminstrator"
      :icon="star"
      data="toggle-admin"
    />

    <menu-item
      v-else
      label="Revoke Admin Rights"
      :icon="starOutline"
      data="toggle-admin"
    />
    <menu-item label="Remove this member" :icon="trash" data="unshare" />
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import { star, starOutline, trash } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action", "data"],
  components: {
    MenuItem,
    IonList,
  },
  data() {
    return {
      star,
      starOutline,
      trash,
    };
  },
};
</script>
