<template>
  <base-layout :page-title="list.title" page-default-back-link="/lists">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title"></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="showMenu">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="medium"
        ></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <items-list
        v-if="list"
        :items="list.items"
        @save-item="saveItem"
        @delete-item="deleteItem"
        @update-item="updateItem"
      ></items-list>
      <div v-if="!list.items">loading</div>
    </template>
    <template v-slot:footer>
      <create-item-form @save-item="saveItem"></create-item-form>
    </template>
  </base-layout>
</template>

<script>
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { popoverController } from "@ionic/core";
import { ellipsisVertical } from "ionicons/icons";

import ItemsList from "../components/item/ItemsList.vue";
import CreateItemForm from "../components/item/CreateItemForm.vue";
import Avatar from "../components/base/Avatar.vue";
import AllItemsMenu from "@/components/item/AllItemsMenu.vue";

export default {
  components: {
    Avatar,
    ItemsList,
    CreateItemForm,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  data() {
    return { ellipsisVertical };
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.listId);
    },
  },
  methods: {
    async showMenu(evt) {
      popoverController
        .create({
          component: AllItemsMenu,
          componentProps: {
            list: this.list,
            action: (evt) => this.menuAction(evt),
          },
          cssClass: "my-custom-class",
          event: evt,
          translucent: true,
        })
        .then((res) => {
          this.menu = res;
          this.menu.present();
        });
    },
    menuAction(evt) {
      this.menu.dismiss();
      const action = evt.target.getAttribute("data");
      switch (action) {
        case "delete":
          this.deleteList();
          break;
      }
    },
    async saveItem(item) {
      this.$store
        .dispatch("addItem", { listId: this.list._id, item })
        .then((res) => {});
    },
    updateItem(item) {
      this.$store
        .dispatch("updateItem", {
          listId: this.list._id,
          itemId: item._id,
          item,
        })
        .then((res) => {});
    },
    deleteItem(itemId) {
      this.$store
        .dispatch("deleteItem", { listId: this.list._id, itemId })
        .then((res) => res)
        .catch((err) => alert(err));
    },
  },
};
</script>
