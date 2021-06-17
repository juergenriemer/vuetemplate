<template>
  <base-layout :page-title="currentList.title" page-id="ListMembersPage" link="/app/list">
    <template v-slot:title>
      <avatar size="large" :list-title="currentList.title" />
    </template>
    <template v-slot:actions-end>
      <div class="header-icon">
        <ion-icon :icon="shareSocial" size="large"></ion-icon>
      </div>
    </template>
    <template v-slot:content>
      <invitation-form :listId="currentList._id"></invitation-form>
      <invitees-list
        v-if="invitees && invitees.length"
        @uninvite="uninvite"
        :items="invitees"
      ></invitees-list>
      <members-list
        @unshare="unshare"
        @toggle-admin="toggleAdmin"
        :items="currentList.users"
      ></members-list>
    </template>
  </base-layout>
</template>

<script>
import Avatar from "@/components/base/Avatar.vue";
import InvitationForm from "@/components/member/CreateInvitationForm.vue";
import { IonIcon } from "@ionic/vue";
import MembersList from "@/components/member/MembersList.vue";
import InviteesList from "@/components/member/InviteesList.vue";
import { shareSocial } from "ionicons/icons";

export default {
  components: {
    InvitationForm,
    MembersList,
    InviteesList,
    IonIcon,
    Avatar,
  },
  data() {
    return {
      shareSocial,
      error: "",
    };
  },
  computed: {
    invitees() {
      return this.currentList ? this.currentList.invitees : null;
    },
  },
  methods: {
    unshare(userId) {
      this.$store
        .dispatch("unshare", {
          listId: this.currentList._id,
          userId,
        })
        .catch((err) => alert(err));
    },
    toggleAdmin(userId, isAdmin) {
      this.$store
        .dispatch("toggleAdmin", {
          listId: this.currentList._id,
          userId,
          isAdmin,
        })
        .catch((err) => alert(err));
    },
    uninvite(email) {
      this.$store
        .dispatch("uninvite", {
          listId: this.currentList._id,
          email,
        })
        .catch((err) => alert(err));
    },
  },
};
</script>
