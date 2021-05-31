<template>
  <ion-list lines="none" @click="action($event)">
    <menu-item
      v-if="data.showMode"
      label="Hide done items"
      :icon="eyeOff"
      data="showMode"
    />
    <menu-item v-else label="Show all items" :icon="eye" data="showMode" />
    <menu-item
      v-if="data.toggleMode"
      label="Mark all items done"
      :icon="checkmarkCircle"
      data="toggleMode"
    />
    <menu-item
      v-else
      label="Mark all items undone"
      :icon="checkmarkCircleOutline"
      data="toggleMode"
    />
    <menu-item
      v-if="data.reorderMode"
      label="Stop reordering"
      :icon="ellipsisVertical"
      data="reorderMode"
    />
    <menu-item
      v-else
      label="Reorder Items"
      :icon="reorderTwo"
      data="reorderMode"
    />
  </ion-list>
</template>
<script>
import { IonList } from "@ionic/vue";
import {
  eye,
  eyeOff,
  checkmarkCircle,
  checkmarkCircleOutline,
  reorderTwo,
  ellipsisVertical,
} from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action", "data"],
  components: {
    MenuItem,
    IonList,
  },
  data() {
    return {
      eye,
      eyeOff,
      checkmarkCircle,
      checkmarkCircleOutline,
      reorderTwo,
      ellipsisVertical,
    };
  },
};
</script>
