<template>
  <ion-item button="true">
    <IonAvatar
      @click="updateItem(item)"
      class="checkbox"
      :class="item.done ? 'done' : ''"
    >
      <ion-icon
        title="USE CHECKMARK-CIRCLE"
        :icon="checkmark"
        xsize="small"
      ></ion-icon>
    </IonAvatar>
    <ion-label @dblclick="updateItem(item)" class="title">
      {{ item.title }}
    </ion-label>
    <ion-reorder v-if="reorderMode" slot="end"></ion-reorder>
    <ion-buttons v-if="!reorderMode" slot="end">
      <ion-button
        v-if="item.comments.length"
        @click="showComment = !showComment"
      >
        <ion-icon
          slot="icon-only"
          :icon="chatboxEllipses"
          size="small"
        ></ion-icon>
      </ion-button>
      <ion-button @click="showMenu">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="small"
        ></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
  <ion-item v-if="showComment">
    <comments-list
      @delete-item="deleteComment"
      :items="item.comments"
    ></comments-list>
  </ion-item>
</template>

<script>
import {
  IonAvatar,
  IonReorder,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonPopover,
  IonToolbar,
} from "@ionic/vue";
import {
  chevronForward,
  ellipsisVertical,
  settings,
  chatboxEllipses,
  checkmark,
  trash,
  create,
} from "ionicons/icons";
import ItemMenu from "@/components/item/ItemMenu.vue";
import CommentsList from "@/components/comment/CommentsList.vue";
import { alertController, popoverController } from "@ionic/core";
export default {
  props: ["item", "reorderMode"],
  emits: ["delete-item", "update-item", "edit-item", "comment-mode"],
  data() {
    return {
      showComment: false,
      menu: null,
      ellipsisVertical,
      chatboxEllipses,
      checkmark,
      chevronForward,
      trash,
      settings,
    };
  },
  components: {
    CommentsList,
    ItemMenu,
    IonReorder,
    IonToolbar,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonPopover,
  },
  mounted() {},
  methods: {
    updateItem() {
      this.item.done = !this.item.done;
      this.$emit("update-item", this.item);
    },
    deleteComment(item) {
      this.$emit("delete-comment", item);
    },
    async showMenu(evt) {
      popoverController
        .create({
          component: ItemMenu,
          componentProps: {
            item: this.item,
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
        case "delete-item":
          this.deleteItem();
          break;
        case "edit-item":
          this.$emit("edit-item", this.item);
          break;
        case "comment-mode":
          this.$emit("comment-mode", this.item);
          break;
      }
    },
    async deleteItem() {
      alertController
        .create({
          header: "Delete item?",
          message: "Are you sure you want to delete this item?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => this.$emit("delete-item", this.item._id),
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
<style>
.jdicon {
  padding: 4px;
}
.title {
  font-size: 1.3em;
}
</style>
