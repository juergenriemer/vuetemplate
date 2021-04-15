<template>
  <ion-list lines="none" @click="action($event)">
    <menu-item label="Logout" :icon="logOut" token="logout" />
    <menu-item label="Change Password" :icon="key" token="reset-password" />
    <menu-item label="My Invitations" :icon="mail" token="approve-invites" />
  </ion-list>
</template>
<script>
import { IonList, IonItem } from "@ionic/vue";
import { mail, key, logOut } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";

export default {
  props: ["action"],
  components: {
    MenuItem,
    IonList,
    IonItem,
  },
  data() {
    return { mail, key, logOut };
  },
};
</script>
