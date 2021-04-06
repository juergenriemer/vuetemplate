<template>
  <base-layout :page-title="list.title" :link="link">
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
        :reorderMode="reorderMode"
        @save-item="saveItem"
        @reorder-list="reorderList"
        @delete-item="deleteItem"
        @update-item="updateItem"
        @edit-item="editItem"
      ></items-list>
      <div v-if="!list.items">loading</div>
    </template>
    <template v-slot:footer>
      <edit-item-form
        v-if="mode == 'edit'"
        :form="edit"
        @update-item="updateItem"
        @stop-editing="mode = 'create'"
      ></edit-item-form>
      <create-item-form
        v-if="mode == 'create'"
        @save-item="saveItem"
      ></create-item-form>
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

import ItemsList from "@/components/item/ItemsList.vue";
import CreateItemForm from "@/components/item/CreateItemForm.vue";
import EditItemForm from "@/components/item/EditItemForm.vue";
import Avatar from "@/components/base/Avatar.vue";
import AllItemsMenu from "@/components/item/AllItemsMenu.vue";

export default {
  components: {
    Avatar,
    ItemsList,
    CreateItemForm,
    EditItemForm,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      mode: "create",
      edit: {},
      toggleMode: false,
      reorderMode: false,
      ellipsisVertical,
    };
  },
  computed: {
    // REF: move to baselayout.. same in ResetPassword.vue
    link() {
      return self.isWeb ? "" : "/app/list";
    },
    list() {
      return this.$store.getters.listById(this.$route.params.id);
    },
  },
  methods: {
    async showMenu(evt) {
      popoverController
        .create({
          component: AllItemsMenu,
          componentProps: {
            list: this.list,
            reorderMode: this.reorderMode,
            toggleMode: this.toggleMode,
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
        case "reorderMode":
          this.reorderMode = !this.reorderMode;
          break;
        case "toggleMode":
          this.toggleMode = !this.toggleMode;
          this.toggleList(this.toggleMode);
          break;
      }
    },
    editItem(item) {
      this.mode = "edit";
      this.edit = item;
    },
    async reorderList({ from, to }) {
      this.$store
        .dispatch("reorderList", { listId: this.list._id, from, to })
        .then((res) => {});
    },
    async saveItem(item) {
      this.$store
        .dispatch("addItem", { listId: this.list._id, item })
        .then((res) => {});
    },
    updateItem(item) {
      this.mode = "create";
      this.edit = {};
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
    async toggleList(done) {
      this.$store
        .dispatch("toggleList", { listId: this.list._id, done })
        .catch((err) => alert(err));
    },
  },
};
</script>
