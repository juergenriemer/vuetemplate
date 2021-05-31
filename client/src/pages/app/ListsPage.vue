<template>
  <base-layout page-title="Listle" page-id="ListsPage">
    <template v-slot:title>
      <avatar
        class="personalAvatar"
        size="large"
        :initials="initials"
        @click="showMenu($event)"
      ></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="nav(addLink)">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <lists-list v-if="lists" :lists="lists" :lastSeen="lastSeen"></lists-list>
      <div v-if="!lists">loading</div>
    </template>
  </base-layout>
</template>

<script>
import { IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { add } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
import ListsList from "@/components/list/ListsList.vue";
import MenuComponent from "@/components/user/UserMenu.vue";
import Menu from "@/mixins/Menu";

export default {
  mixins: [Menu],
  components: {
    Avatar,
    ListsList,
    MenuComponent,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return { add };
  },
  computed: {
    initials() {
      let user = this.$store.getters.user;
      return user ? user.short : "";
    },
    lists() {
      return this.$store.getters.lists;
    },
    addLink() {
      const listId = this.$route.params.id;
      let link = `/app/add`;
      link += this.currentList._id ? `/${this.currentList._id}` : ``;
      return link;
    },
  },
  methods: {
    menuAction(action) {
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
          const listId = this.currentList._id;
          var link = `/app/approve-invites`;
          link += listId ? `/${listId}` : ``;
          this.nav(link);
          break;
        case "reset-password":
          var link = `/app/reset-password`;
          link += listId ? `/${listId}` : ``;
          this.nav(link);
          break;
        case "delete-user":
          var link = `/user/delete`;
          this.nav(link);
          break;
          case "toggle-app-mode":
            let appMode = localStorage.getItem( "appMode") || "online";
            appMode = ( appMode == "online") ? "offline" : "online";
            localStorage.setItem( "appMode", appMode )
            self.location.reload();
            break;
        case "memberships":
          var link = `/app/memberships`;
          link += listId ? `/${listId}` : ``;
          this.nav(link);
          break;
      }
    },
  },
};
</script>
<style>
.personalAvatar {
  margin-left:0.5em;
    cursor: pointer;
  }
</style>
