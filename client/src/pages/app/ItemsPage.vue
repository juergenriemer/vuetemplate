<template>
  <base-layout :page-title="currentList.title" :link="link">
    <template v-slot:title>
      <avatar size="large" :list-title="currentList.title"></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="showMenu($event, menuData)">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="medium"
        ></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <items-list
        v-if="currentList"
        :listId="currentList._id"
        :items="currentList.items"
        :reorderMode="reorderMode"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></items-list>
      <div v-if="!currentList">loading</div>
    </template>
    <template v-slot:footer>
      <create-item-form
        :listId="currentList._id"
        v-if="!itemInEditMode"
      ></create-item-form>
      <edit-item-form
        v-if="itemInEditMode"
        :listId="currentList._id"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></edit-item-form>
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
import { ellipsisVertical } from "ionicons/icons";

import ItemsList from "@/components/item/ItemsList.vue";
import CreateItemForm from "@/components/item/CreateItemForm.vue";
import EditItemForm from "@/components/item/EditItemForm.vue";
import Avatar from "@/components/base/Avatar.vue";
import MenuComponent from "@/components/item/AllItemsMenu.vue";

import Menu from "@/mixins/Menu";
export default {
  mixins: [Menu],
  components: {
    Avatar,
    ItemsList,
    CreateItemForm,
    EditItemForm,
    MenuComponent,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      edit: {},
      actionItem: {},
      toggleMode: false,
      reorderMode: false,
      ellipsisVertical,
      itemInEditMode: null,
      itemInCommentMode: null,
    };
  },
  computed: {
    // REF: move to baselayout.. same in ResetPassword.vue
    link() {
      return self.isWeb ? "" : "/app/list";
    },
    menuData() {
      return { reorderMode: this.reorderMode, toggleMode: this.toggleMode };
    },
  },
  methods: {
    menuAction(action) {
      switch (action) {
        case "reorderMode":
          this.reorderMode = !this.reorderMode;
          break;
        case "toggleMode":
          this.toggleMode = !this.toggleMode;
          this.$store
            .dispatch("toggleList", {
              listId: this.currentList._id,
              done: this.toggleMode,
            })
            .catch((err) => this.showError(err));

          break;
      }
    },
    changeMode({ mode, item }) {
      this.itemInEditMode = null;
      this.itemInCommentMode = null;
      switch (mode) {
        case "edit":
          this.itemInEditMode = item;
          break;
        case "comment":
          this.itemInCommentMode = item;
          break;
      }
    },
  },
};
</script>
