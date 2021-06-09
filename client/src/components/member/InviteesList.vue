<template>
  <div v-if="items">
    <ion-list-header>Pending invitations</ion-list-header>
    <ion-list>
      <item
        @uninvite="uninvite"
        v-for="item in items"
        :item="item"
      ></item>
    </ion-list>
  </div>
</template>

<script>
import { IonListHeader, IonList } from "@ionic/vue";
import Item from "./InviteesListItem.vue";

export default {
  emits: ["uninvite"],
  props: ["items"],
  components: {
    IonListHeader,
    IonList,
    Item,
  },
  methods: {
    uninvite(email) {
      this.$emit("uninvite", email);
    },
  },
};
</script>
