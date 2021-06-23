<template>
  <ion-list>
    <ion-item-divider>
      <ion-label>{{header}}</ion-label>
      <!-- remove star for now, perhaps I also remove from everywhere -->
      <!--ion-icon slot="start" :icon="star" size="small"></ion-icon-->
    </ion-item-divider>
    <item
      @toggle-admin="toggleAdmin"
      @unshare="unshare"
      v-for="item in items"
      :key="item._id"
      :item="item"
      :menu="menu"
    ></item>
  </ion-list>
</template>

<script>
import { IonList, IonItemDivider, IonLabel, IonIcon } from "@ionic/vue";
import Item from "./MembersListItem.vue";
import { star } from "ionicons/icons";

export default {
  emits: ["toggle-admin", "unshare"],
  props: ["items", "header", "menu"],
  components: {
    IonItemDivider,
    IonLabel,
    IonList,
    Item,
  },
  data() {
      return {
        star,
      };
  },
  methods: {
    unshare(itemId) {
      this.$emit("unshare", itemId);
    },
    toggleAdmin(itemId, isAdmin) {
      this.$emit("toggle-admin", itemId, isAdmin);
    },
  },
};
</script>
