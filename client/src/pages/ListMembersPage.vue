<template>
  <base-layout :page-title="list.title" page-default-back-link="/lists">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title"></avatar>
    </template>
    <template v-slot:content>
      <ion-list>
        <ion-list-header>Invite a friend</ion-list-header>
        <form class="ion-padding" @submit.prevent="submitForm">
          <ion-list>
            <ion-item>
              <ion-label position="floating">Email of friend</ion-label>
              <ion-input type="text" required v-model="email" />
            </ion-item>
          </ion-list>
          <ion-button type="submit" expand="block">INVITE</ion-button>
        </form>
        {{ list.invitees }}
        {{ members }}
        <div v-if="invitees.length">
          <ion-list-header>Pending invitations</ion-list-header>
          <members-list :items="invitees"></members-list>
        </div>
        <ion-list-header>Current Members</ion-list-header>
        <members-list :items="list.users"></members-list>
      </ion-list>
    </template>
    <template v-slot:footer> </template>
  </base-layout>
</template>

<script>
import {
  IonList,
  IonListHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { verticalEllipsis } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
import MembersList from "@/components/member/MembersList.vue";

export default {
  components: {
    MembersList,
    Avatar,
    IonInput,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
  },
  data() {
    return { email: "mordret@sms.at", verticalEllipsis };
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.listId) || [];
    },
    owner() {
      let user = this.list.users.find((usr) => usr.role == "owner");
      return user && user.name ? user.name : "n/a";
    },
    members() {
      return this.$store.getters.members;
    },
    invitees() {
      console.log(this.list.invitees);
      return this.list.invitees;
    },
  },
  methods: {
    submitForm() {
      this.$store
        .dispatch("invite", {
          listId: this.list._id,
          email: this.email,
          role: "user",
        })
        .then((res) => res)
        .catch((err) => alert(err));
    },
  },
};
</script>
