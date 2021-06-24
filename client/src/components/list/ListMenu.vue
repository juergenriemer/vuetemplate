<template>
  <ion-list lines="none" @click="action">
    <menu-item label="List Info" :icon="informationCircle" data="info" />
    <menu-item v-if="admin" label="Share List" :icon="shareSocial" data="members" />
    <menu-item v-if="admin" label="Edit List" :icon="create" data="edit" />
    <menu-item v-if="owner" label="Delete List" :icon="trash" data="delete" />
    <menu-item
      v-if="!owner"
      label="Cancel membership"
      :icon="trash"
      data="leave"
    />
  </ion-list>
</template>

<script>
import { IonList } from "@ionic/vue";
import { informationCircle, shareSocial, create, trash } from "ionicons/icons";
import MenuItem from "@/components/base/MenuItem.vue";
import User from "@/mixins/User";

export default {
  props: ["data", "action"],
  mixins: [User],
  components: {
    MenuItem,
    IonList,
  },
  computed: {
    owner() {
      return this.data.list.users.find((usr) => usr.role == "owner" && usr.userId == this.myId() );
    },
    admin() {
      return this.owner || this.data.list.users.find((usr) => usr.role == "admin" && usr.userId == this.myId() );
    },
  },
  data() {
    return {
      informationCircle,
      shareSocial,
      create,
      trash,
    };
  },
};
</script>
