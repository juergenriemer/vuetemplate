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
      <ion-list>
        <ion-item-divider>
          <ion-label>About</ion-label>
        </ion-item-divider>
        <ion-item lines="none">
          <b>{{currentList.title}}</b>
        </ion-item>
        <ion-item lines="none" v-if="currentList.description">
          <i>{{currentList.description}}</i>
        </ion-item>
        <ion-item lines="none">
            This list is a {{types[currentList.type]}} created by {{owner[0].name}} {{ ago(currentList.createdAt) }} ago.
        </ion-item>
      <members-list
        header="Owner"
        class="grid"
        :items="owner"
        menu=false
      ></members-list>
      <members-list
        v-if="admins.length > 0"
        header="Administrators"
        class="grid"
        :items="admins"
        menu=false
      ></members-list>
      <members-list
        v-if="users.length > 0"
        header="Users"
        class="grid"
        :items="users"
        menu=false
      ></members-list>


      </ion-list>
    </template>
  </base-layout>
</template>
<script>
import { IonListHeader, IonList, IonItem, IonLabel, IonIcon, IonItemDivider } from "@ionic/vue";
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
    IonItemDivider,
  },
  data() {
    return { list: this.currentList, informationCircle
    , types : {
      'check' : 'Check-Listle'
      , 'vote' : 'Vote-Listle'
      , 'grab' : 'Grab-Listle'
    }
    };
  },
  computed: {
    owner() {
      return this.currentList.users.filter( usr => usr.role == "owner")
    },
    admins() {
      return this.currentList.users.filter( usr => usr.role == "admin")
    },
    users() {
      return this.currentList.users.filter( usr => usr.role == "user")
    },
  },
  methods: {
  },
};
</script>
