<template>
  <ion-list lines="none" @click="action">
    <menu-item label="List Info" :icon="informationCircle" data="info" />
    <menu-item label="Share List" :icon="shareSocial" data="members" />
    <menu-item label="Edit List" :icon="create" data="edit" />
    <menu-item v-if="owner" label="Delete List" :icon="trash" data="delete" />
    <menu-item
      v-if="owner"
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
      return true;
      const ownerId = this.data.list.users.find((usr) => usr.role == "owner")
        .userId;
      return ownerId == this.myId();
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
