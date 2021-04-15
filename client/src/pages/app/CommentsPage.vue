<template>
  <base-layout :page-title="title" :link="link">
    <template v-slot:title>
      <avatar size="large" :list-title="title"></avatar>
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
      <comments-list
        v-if="item"
        :items="item.comments"
        :itemId="item._id"
        :itemInEditMode="itemInEditMode"
      ></comments-list>
      <div v-if="!list.items">loading</div>
    </template>
    <template v-slot:footer>
      <create-comment-form
        :item="item"
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

import CommentsList from "@/components/comment/CommentsList.vue";
import CreateCommentForm from "@/components/comment/CreateCommentForm.vue";
import Avatar from "@/components/base/Avatar.vue";

export default {
  components: {
    Avatar,
    CommentsList,
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
      ellipsisVertical,
      itemInEditMode: null,
      itemInCommentMode: null,
    };
  },
  computed: {
    // REF: move to baselayout.. same in ResetPassword.vue
    link() {
      const lnk = self.isWeb ? "" : `/app/items/${this.listId()}`;
      return lnk;
    },
    list() {
      return this.$route.params.id
        ? this.$store.getters.listById(this.$route.params.id)
        : null;
    },
    item() {
      console.log(">>>>>>>>>>>>>>", this.$route.params);
      const itemId = this.$route.params.itemId;
      console.log(">>>>>>>>>>>>>>", itemId);
      return itemId
        ? this.list.items.find((itm) => itm._id == this.$route.params.itemId)
        : null;
    },
    title() {
      return this.item ? this.item.title : "";
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
