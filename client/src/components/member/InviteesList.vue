<template>
  <div v-if="items">
    <ion-list>
      <ion-item-divider>
        <ion-label>Pending Invitations</ion-label>
      </ion-item-divider>
      <item
        @uninvite="uninvite"
        v-for="item in items"
        :item="item"
      ></item>
    </ion-list>
  </div>
</template>

<script>
import { IonItemDivider, IonLabel, IonList } from "@ionic/vue";
import Item from "./InviteesListItem.vue";

export default {
  emits: ["uninvite"],
  props: ["items"],
  components: {
    IonItemDivider,
    IonLabel,
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
