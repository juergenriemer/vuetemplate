<template>
  <base-layout :page-title="list.title" page-default-back-link="/lists">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title"></avatar>
    </template>
    <template v-slot:content>
      <ion-list lines="none">
        <ion-list-header> Information </ion-list-header>
        <ion-item lines="none" v-if="list.description">{{
          list.description
        }}</ion-item>
        <ion-item>Created on {{ list.createdAt }}</ion-item>
        <ion-item>Created by {{ owner }}</ion-item>
        <ion-item>List type: Checklist</ion-item>
        <members-list :items="list.users"></members-list>
      </ion-list>
    </template>
  </base-layout>
</template>
<script>
import { IonListHeader, IonList, IonItem, IonLabel, IonIcon } from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import MembersList from "@/components/member/MembersList.vue";

export default {
  components: {
    Avatar,
    MembersList,
    IonListHeader,
    IonList,
    IonItem,
    IonLabel,
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.listId);
    },
    owner() {
      let user = this.list.users.find((usr) => usr.role == "owner");
      return user && user.name ? user.name : "n/a";
    },
  },
};
</script>
