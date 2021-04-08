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
        :itemInCommentMode="itemInCommentMode"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></items-list>
      <div v-if="!list.items">loading</div>
    </template>
    <template v-slot:footer>
      <create-item-form
        v-if="!itemInEditMode && !itemInCommentMode"
      ></create-item-form>
      <edit-item-form
        v-if="itemInEditMode"
        :form="itemInEditMode"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></edit-item-form>
      <create-comment-form
        v-if="itemInCommentMode"
        :itemInCommentMode="itemInCommentMode"
        @change-mode="changeMode"
      ></create-comment-form>
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
import CreateCommentForm from "@/components/comment/CreateCommentForm.vue";
import Avatar from "@/components/base/Avatar.vue";
import AllItemsMenu from "@/components/item/AllItemsMenu.vue";

export default {
  components: {
    Avatar,
    ItemsList,
    CreateItemForm,
    EditItemForm,
    CreateCommentForm,
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
          this.$store
            .dispatch("toggleList", {
              listId: this.listId(),
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
