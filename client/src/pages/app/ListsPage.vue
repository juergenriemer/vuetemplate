<template>
  <base-layout page-title="Listle">
    <template v-slot:title>
      <avatar
        style="cursor: pointer"
        size="large"
        :user-id="userId"
        @click="showMenu"
      ></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="nav(addLink)">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <lists-list
        v-if="lists"
        :lists="lists"
        @delete-list="deleteList"
      ></lists-list>
      <div v-if="!lists">loading</div>
    </template>
  </base-layout>
</template>

<script>
import { IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { add } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
import ListsList from "@/components/list/ListsList.vue";
import UserMenu from "@/components/user/UserMenu.vue";
import { popoverController } from "@ionic/core";

export default {
  components: {
    Avatar,
    ListsList,
    UserMenu,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return { add };
  },
  computed: {
    userId() {
      let user = this.$store.getters.user;
      return user ? user._id : "";
    },
    lists() {
      return this.$store.getters.lists;
    },
    addLink() {
      const listId = this.$route.params.id;
      let link = `/app/add`;
      link += listId ? `/${listId}` : ``;
      return link;
    },
  },
  methods: {
    updateList(listId) {},
    deleteList(listId) {
      this.$store
        .dispatch("deleteList", { listId })
        .then((res) => res)
        .catch((err) => alert(err));
    },
    async fetch() {
      // no longer needed if we call on app.js level!!!!!
      // saw list should be triggerd in ItemsPage
      if (!self.isLocal)
        this.$store
          .dispatch("fetchLists")
          .then(() => {
            if (this.listId) {
              return this.sawList({ listId: this.listId, userId: this.userId });
            }
          })
          .catch((err) => {
            this.showError(err);
          });
    },
    async showMenu(evt) {
      popoverController
        .create({
          component: UserMenu,
          componentProps: {
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
        case "logout":
          this.$store
            .dispatch("logout")
            .then(() => {
              this.nav(`/user/login`);
            })
            .catch((err) => {
              this.showError(err);
            });
          break;
        case "approve-invites":
          this.nav(`/user/approve-invites`);
          break;
      }
    },
  },
};
</script>
