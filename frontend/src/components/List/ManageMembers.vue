<template lang="pug">
.form
  h4 Current Members
  .rows
    .row(v-for="user in list.users", :key="user._id")
      .avatar(:style="{ background: avatarColor(user.short) }") {{ user.short }}
        i.fas.fa-crown.admin.owner(v-if="user.role == 'owner'")
        i.fas.fa-crown.admin(v-if="user.role == 'admin'")
      .title {{ user.name }}
      .menu(v-if="listAdmin && user.role != 'owner'")
        i.fas.fa-ellipsis-v
        ul
          li(@click="toggleAdminFor(user.userId, user.role)") Set/Unset as admin
          li(@click="unshareWith(user.userId)") Remove user from list
  br
  div(v-if="list.invitees.length")
    h4 Pending Invitations
    .rows
      .row(v-for="user in list.invitees", :key="user._id")
        .title {{ user.email }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Menu from "@/mixins/Menu";

export default {
  name: "ManageMembers",
  mixins: [Menu],
  data() {
    return {
      processing: false,
    };
  },
  created() {},
  computed: {
    ...mapGetters(["lists", "user"]),
    list() {
      const list = this.lists.find((list) => list._id == this.listId);
      return list || {};
    },
    listId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions(["toggleAdmin", "unshare"]),
    close() {
      bus.$emit("manageMembers", false);
    },
    async toggleAdminFor(userId, role) {
      if (this.processing) {
        return;
      }
      const isAdmin = role == "user";
      this.processing = true;
      this.toggleAdmin({
        listId: this.listId,
        userId,
        isAdmin,
      })
        .then(() => {
          this.hideAllPanels();
          this.processing = false;
        })
        .catch((err) => this.showError(err));
    },
    async unshareWith(userId) {
      this.unshare({
        listId: this.listId,
        userId,
      }).catch((err) => this.showError(err));
    },
  },
};
</script>
