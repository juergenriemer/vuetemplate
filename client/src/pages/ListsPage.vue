<template>
  <base-layout page-title="Listle">
    <template v-slot:title>
      <avatar size="large" :user-id="userId"></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="nav(`/list/add`)">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <lists-list
        v-if="lists"
        :lists="lists"
        @delete-list="deleteList"
        @update-list="updateList"
      ></lists-list>
      <div v-if="!lists">loading</div>
    </template>
  </base-layout>
</template>

<script>
import { IonButton, IonIcon } from "@ionic/vue";
import { add } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
import ListsList from "@/components/list/ListsList.vue";

export default {
  components: {
    Avatar,
    ListsList,
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
  },
};
</script>
