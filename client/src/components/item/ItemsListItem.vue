<template>
  <ion-item>
    <IonAvatar
      @click="updateItem(item)"
      class="checkbox"
      :class="item.done ? 'done' : ''"
    >
      <ion-icon :icon="checkmark" xsize="small"></ion-icon>
    </IonAvatar>
    <ion-label class="title"> {{ item.title }} </ion-label>
    <ion-buttons slot="end">
      <ion-button @click="showMenu">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="small"
        ></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import {
  IonAvatar,
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
  checkmark,
  trash,
  create,
} from "ionicons/icons";
import ItemMenu from "@/components/item/ItemMenu.vue";
import { alertController, popoverController } from "@ionic/core";
export default {
  props: ["item"],
  data() {
    return {
      menu: null,
      ellipsisVertical,
      checkmark,
      chevronForward,
      trash,
      settings,
    };
  },
  components: {
    IonToolbar,
    ItemMenu,
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
        case "delete":
          this.deleteItem();
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
