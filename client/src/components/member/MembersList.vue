<template>
  <ion-list-header>Current Members</ion-list-header>
  <ion-list>
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
import { IonListHeader, IonList } from "@ionic/vue";
import Item from "./MembersListItem.vue";

export default {
  emits: ["toggle-admin", "unshare"],
  props: ["items", "admin"],
  components: {
    IonListHeader,
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
