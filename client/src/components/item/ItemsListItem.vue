<template>
  <div>
    <ion-item item-root button="true" :class="commenting ? 'comment-mode' : ''">
      <IonAvatar
        @click="checkItem(item)"
        class="checkbox"
        :class="item.done ? 'done' : ''"
      >
        <ion-icon title="USE CHECKMARK-CIRCLE" :icon="checkmark"></ion-icon>
      </IonAvatar>
      <ion-label @dblclick="checkItem(item)" class="title">
        {{ item.title }}
      </ion-label>
      <ion-reorder v-if="reorderMode" slot="end"></ion-reorder>
      <ion-buttons v-if="!reorderMode" slot="end">
        <ion-button
          v-if="item.comments.length"
          @click="
            $emit('change-mode', {
              mode: 'comment',
              item: commenting ? null : item,
            })
          "
        >
          <ion-icon slot="icon-only" :icon="chatboxEllipses"></ion-icon>
        </ion-button>
        <ion-button @click="showMenu">
          <ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item v-if="commenting">
      <comments-list
        @delete-item="deleteComment"
        :items="item.comments"
        :itemId="item._id"
      ></comments-list>
    </ion-item>
  </div>
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
  props: ["item", "reorderMode", "itemInCommentMode"],
  emits: ["change-mode"],
  data() {
    return {
      commentMode: true,
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
  computed: {
    commenting() {
      return (
        this.itemInCommentMode && this.itemInCommentMode._id == this.item._id
      );
    },
  },
  methods: {
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
      let data;
      switch (action) {
        case "delete-item":
          this.deleteItem();
          break;
        case "edit-mode":
          data = { mode: "edit", item: this.item };
          this.$emit("change-mode", data);
          break;
        case "comment-mode":
          data = { mode: "comment", item: this.item };
          this.$emit("change-mode", data);
          break;
      }
    },
    checkItem() {
      this.item.done = !this.item.done;
      this.$store
        .dispatch("updateItem", {
          listId: this.listId(),
          itemId: this.item._id,
          item: this.item,
        })
        .then((res) => {})
        .catch((err) => {
          this.showError(err);
        });
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
              handler: () => {
                this.$store
                  .dispatch("deleteItem", {
                    listId: this.listId(),
                    itemId: this.item._id,
                  })
                  .then((res) => res)
                  .catch((err) => this.showError(err));
              },
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
<style>
.comment-mode {
  --background: primary;
  background: goldenrod;
}
.jdicon {
  padding: 4px;
}
.title {
  font-size: 1.3em;
}
</style>
