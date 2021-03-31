<template>
  <ion-item>
    <avatar size="medium" :short="item.short"></avatar>
    <ion-label class="title">
      {{ item.name }}
    </ion-label>
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
import Avatar from "@/components/base/Avatar.vue";
import InviteesMenu from "@/components/member/InviteesMenu.vue";
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { popoverController, alertController } from "@ionic/core";

export default {
  emits: ["uninvite"],
  props: ["item"],
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
          component: InviteesMenu,
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
        case "uninvite":
          this.deleteList();
          break;
      }
    },
    async deleteList() {
      alertController
        .create({
          header: "Whithdraw Invitation?",
          message: `Are you sure you want to withdraw the invitation? 
          An email has already been sent to your friend.`,
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => this.$emit("uninvite", this.item.email),
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
