<template>
  <ion-item>
    <avatar size="medium" :initials="item.short"></avatar>
    <ion-label class="title">
      {{ item.name }}
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
import Avatar from "@/components/base/Avatar.vue";
import MenuComponent from "@/components/member/InviteesMenu.vue";
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { alertController } from "@ionic/core";
import Menu from "@/mixins/Menu";

export default {
  emits: ["uninvite"],
  props: ["item"],
  mixins: [Menu],
  data() {
    return {
      ellipsisVertical,
    };
  },
  components: {
    Avatar,
    MenuComponent,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
  },
  methods: {
    menuAction(action) {
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
