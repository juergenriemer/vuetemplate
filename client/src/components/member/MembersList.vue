<template>
  <ion-list>
    <ion-item-divider>
      <ion-label>Current Members</ion-label>
    </ion-item-divider>
    <item
      @toggle-admin="toggleAdmin"
      @unshare="unshare"
      v-for="item in items"
      :key="item._id"
      :item="item"
      :admin="admin"
    ></item>
  </ion-list>
</template>

<script>
import { IonList, IonItemDivider, IonLabel } from "@ionic/vue";
import Item from "./MembersListItem.vue";

export default {
  emits: ["toggle-admin", "unshare"],
  props: ["items", "admin"],
  components: {
    IonItemDivider,
    IonLabel,
    IonList,
    Item,
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
