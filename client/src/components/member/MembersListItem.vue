<template>
  <ion-item>
    <avatar size="medium" :role="item.role" :short="item.short"></avatar>
    <ion-label class="title">
      {{ item.name }}
    </ion-label>
    <ion-buttons v-if="admin && item.role != 'xowner'" slot="end">
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
import Avatar from "@/components/base/Avatar.vue";
import MembersMenu from "@/components/member/MembersMenu.vue";
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { popoverController, alertController } from "@ionic/core";

export default {
  emits: ["unshare", "toggle-admin"],
  props: ["item", "admin"],
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
      popoverController
        .create({
          component: MembersMenu,
          componentProps: {
            action: (evt) => this.menuAction(evt),
          },
          event: evt,
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
        case "unshare":
          this.unshare();
          break;
        case "toggle-admin":
          const isAdmin = this.item.role != "admin";
          this.$emit("toggle-admin", this.item.userId, isAdmin);
          break;
      }
    },
    async unshare() {
      alertController
        .create({
          header: "Remove member?",
          message: "Are you sure you want to remove the user?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => this.$emit("unshare", this.item.userId),
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
