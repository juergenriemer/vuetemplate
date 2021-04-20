<template>
  <ion-list lines="none" @click="action($event)">
    <menu-item label="Edit this item" :icon="create" data="edit-mode" />
    <menu-item label="Delete this item" :icon="trash" data="delete-item" />
  </ion-list>
</template>
<script>
import { IonList } from "@ionic/vue";
import { create, trash } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action"],
  components: {
    MenuItem,
    IonList,
  },
  data() {
    return {
      create,
      trash,
    };
  },
};
</script>
