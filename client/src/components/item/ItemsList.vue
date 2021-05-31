<template>
  <ion-list>
    <ion-reorder-group
      @ionItemReorder="reorder($event)"
      :disabled="!reorderMode"
    >
      <items-list-item
        @change-mode="changeMode"
        v-for="item in items"
        :key="item._id"
        :listId="listId"
        :item="item"
        :lastSeen="lastSeen"
        :itemInEditMode="itemInEditMode"
        :reorderMode="reorderMode"
      ></items-list-item>
    </ion-reorder-group>
  </ion-list>
</template>

<script>
import { IonList, IonReorderGroup } from "@ionic/vue";
import ItemsListItem from "./ItemsListItem.vue";

export default {
  emits: ["change-mode"],
  props: ["listId", "items", "reorderMode", "itemInEditMode", "lastSeen"],
  components: {
    IonList,
    IonReorderGroup,
    ItemsListItem,
  },
  data() {
    return {};
  },
  methods: {
    async reorder(evt) {
      const { from, to } = evt.detail;
      this.$store
        .dispatch("reorderList", { listId: this.listId, from, to })
        .then((res) => {
          evt.detail.complete();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
    changeMode(data) {
      this.$emit("change-mode", data);
    },
  },
};
</script>
