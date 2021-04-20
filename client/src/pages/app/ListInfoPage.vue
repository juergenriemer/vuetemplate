<template>
  <base-layout :page-title="currentList.title" link="/app/list">
    <template v-slot:title>
      <avatar size="large" :list-title="currentList.title" />
    </template>
    <template v-slot:actions-end>
      <div class="header-icon">
        <ion-icon :icon="informationCircle" size="large"></ion-icon>
      </div>
    </template>
    <template v-slot:content>
      <ion-list lines="none">
        <ion-list-header> Information </ion-list-header>
        <ion-item lines="none"
          >Title: <b>{{ currentList.title }}</b></ion-item
        >
        <ion-item lines="none" v-if="currentList.description">
          Description:{{ currentList.description }}</ion-item
        >
        <ion-item>Created: {{ ago(currentList.createdAt) }} ago</ion-item>
        <ion-item>Created by: {{ owner() }}</ion-item>
        <ion-item>List type: Checklist</ion-item>
        <members-list :items="currentList.users"></members-list>
      </ion-list>
    </template>
  </base-layout>
</template>
<script>
import { IonListHeader, IonList, IonItem, IonLabel, IonIcon } from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import MembersList from "@/components/member/MembersList.vue";
import { informationCircle } from "ionicons/icons";
import Dates from "@/mixins/Dates";

export default {
  mixins: [Dates],
  components: {
    Avatar,
    MembersList,
    IonListHeader,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },
  data() {
    return { list: this.currentList, informationCircle };
  },
  methods: {
    owner() {
      let user;
      if (this.currentList.users) {
        user = this.currentList.users.find((usr) => usr.role == "owner");
      }
      return user && user.name ? user.name : "n/a";
    },
  },
};
</script>
