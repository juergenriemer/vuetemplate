<template>
  <ion-item @click="nav(`/app/items/${list._id}`)" button="true">
    <avatar size="medium" :list-title="list.title"></avatar>
    <ion-label class="title">
      {{ list.title }}
    </ion-label>
    <ion-buttons slot="end">
      <ion-button @click="showMenu($event, { list })">
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
import { alertController } from "@ionic/core";
import Avatar from "@/components/base/Avatar.vue";
import MenuComponent from "@/components/list/ListMenu.vue";
import Menu from "@/mixins/Menu";

export default {
  props: ["list"],
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
        case "delete":
          this.deleteList();
          break;
        case "leave":
          this.leaveList();
          break;
        case "info":
          this.nav(`/app/info/${this.list._id}`);
          break;
        case "members":
          this.nav(`/app/members/${this.list._id}`);
          break;
        case "edit":
          this.nav(`/app/edit/${this.list._id}`);
          break;
      }
    },
    async leaveList() {
      alertController
        .create({
          header: "Leave list?",
          message: "Are you sure you want to leave this list?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => {
                this.$store
                  .dispatch("leaveList", { listId: this.list._id })
                  .then((res) => res)
                  .catch((err) => this.showError(err));
              },
            },
          ],
        })
        .then((res) => res.present());
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
