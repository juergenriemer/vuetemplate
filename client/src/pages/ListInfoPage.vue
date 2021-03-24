<template>
  <base-layout :page-title="list.title" page-default-back-link="/lists">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title"></avatar>
    </template>
    <template v-slot:content>
      <ion-list>
        <ion-list-header> Information </ion-list-header>
        <ion-item v-if="list.description">{{ list.description }}</ion-item>
        <ion-item>Created on {{ list.createdAt }}</ion-item>
        <ion-item>Created by {{ owner }}</ion-item>
        <ion-item>List type: Checklist</ion-item>
        <ion-list-header> Current Members </ion-list-header>
        <ion-item v-for="user in list.users" :key="list._id">
          <avatar
            size="medium"
            :role="user.role"
            :user-id="user.userId"
          ></avatar>
          <ion-label class="title">
            {{ user.name }}
          </ion-label>
          <ion-icon slot="end" :icon="chevronForward" size="small"></ion-icon>
        </ion-item>
      </ion-list>
    </template>
    <template v-slot:footer> </template>
  </base-layout>
</template>
<script>
//import
//import CreateListForm from "../components/list/CreateListForm.vue";
import { IonListHeader, IonList, IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { build, chevronForward } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";

export default {
  components: {
    Avatar,
    IonListHeader,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  },
  data() {
    return { build, chevronForward };
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
  methods: {},
};
</script>
