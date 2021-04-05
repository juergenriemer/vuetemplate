<template>
  <ion-item @click="nav(`/app/items/${list._id}`)" button="true">
    <avatar size="medium" :list-title="list.title"></avatar>
    <ion-label class="title">
      {{ list.title }}
    </ion-label>
    <ion-buttons slot="end">
      <ion-button @click="showMenu($event)">
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
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { popoverController, alertController } from "@ionic/core";
import Avatar from "@/components/base/Avatar.vue";
import ListMenu from "@/components/list/ListMenu.vue";

export default {
  props: ["list"],
  data() {
    return {
      ellipsisVertical,
    };
  },
  components: {
    Avatar,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
  },
  methods: {
    async showMenu(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      popoverController
        .create({
          component: ListMenu,
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
      const listId = this.list._id;
      switch (action) {
        case "delete":
          this.deleteList();
          break;
        case "info":
          this.nav(`/app/info/${listId}`);
          break;
        case "members":
          this.nav(`/app/members/${listId}`);
          break;
        case "edit":
          this.nav(`/app/edit/${listId}`);
          break;
      }
    },
    listSettings(listId) {
      alert("settings for " + listId);
    },
    async deleteList() {
      alertController
        .create({
          header: "Delete list?",
          message: "Are you sure you want to delete this list?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => this.$emit("delete-list", this.list._id),
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
<style>
.title {
  font-size: 1.3em;
}
</style>
