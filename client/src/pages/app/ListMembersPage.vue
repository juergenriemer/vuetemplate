<template>
  <base-layout :page-title="list.title" link="/app/list">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title"></avatar>
    </template>
    <template v-slot:content>
      <invitation-form :error="error" @invite="invite"></invitation-form>
      <invitees-list
        v-if="invitees && invitees.length"
        @uninvite="uninvite"
        :items="invitees"
      ></invitees-list>
      <members-list
        @unshare="unshare"
        @toggle-admin="toggleAdmin"
        :items="list.users"
        admin="true"
      ></members-list>
    </template>
  </base-layout>
</template>

<script>
import Avatar from "@/components/base/Avatar.vue";
import InvitationForm from "@/components/member/CreateInvitationForm.vue";
import MembersList from "@/components/member/MembersList.vue";
import InviteesList from "@/components/member/InviteesList.vue";

export default {
  components: {
    InvitationForm,
    MembersList,
    InviteesList,
    Avatar,
  },
  data() {
    return {
      error: "",
    };
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.id) || [];
    },
    invitees() {
      return this.list ? this.list.invitees : null;
    },
  },
  methods: {
    unshare(userId) {
      this.$store
        .dispatch("unshare", {
          listId: this.list._id,
          userId,
        })
        .catch((err) => alert(err));
    },
    toggleAdmin(userId, isAdmin) {
      this.$store
        .dispatch("toggleAdmin", {
          listId: this.list._id,
          userId,
          isAdmin,
        })
        .catch((err) => alert(err));
    },
    uninvite(email) {
      this.$store
        .dispatch("uninvite", {
          listId: this.list._id,
          email,
        })
        .catch((err) => alert(err));
    },
    invite(email) {
      console.log(email);
      this.error = "";
      const errors = {
        "user-already-member": "This user is already a member.",
        "user-already-invited": "This user is already invited.",
      };
      this.$store
        .dispatch("invite", {
          listId: this.list._id,
          email,
          role: "user",
        })
        .catch((err) => {
          if (err.status && err.status == 422) this.error = errors[err.message];
          else alert(err);
        });
    },
  },
};
</script>
