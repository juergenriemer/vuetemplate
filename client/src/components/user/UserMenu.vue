<template>
  <ion-list lines="none" @click="action($event)">
    <menu-item label="Logout" :icon="logOut" data="logout" />
    <menu-item label="My Memberships" :icon="people" data="memberships" />
    <menu-item label="My Invitations" :icon="mail" data="approve-invites" />
    <menu-item label="Change Password" :icon="key" data="reset-password" />
    <menu-item label="Delete Account" :icon="trash" data="delete-user" />
  </ion-list>
</template>
<script>
import { IonList } from "@ionic/vue";
import { mail, people, key, logOut, trash } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action"],
  components: {
    MenuItem,
    IonList,
  },
  data() {
    return { mail, people, key, logOut, trash };
  },
};
</script>
