<template lang="pug">
.form
  h3 Name & Description
    w-form(novalidate, @validate="validate")
      w-input#title.mb4(
        label="TITLE",
        name="title",
        v-model="list.title",
        :disabled="sending",
        :validators="[valid.firstName]",
        required
      )
      w-textarea#description.mb4(
        label="Describe this list",
        name="description",
        v-model="description",
        :disabled="sending"
      )
  h3 Members
    .rows
      .row(v-for="user in list.users", :key="user._id")
        .avatar(:style="{ background: avatarColor(user.short) }") {{ user.short }}
          i.fas.fa-crown.admin.owner(v-if="user.role == 'owner'")
          i.fas.fa-crown.admin(v-if="user.role == 'admin'")
        .title {{ user.name }}
        .admin-toggle
          w-checkbox(
            @input="toggleAdminNow(user.userId, $event)",
            :value="user.role != 'user'",
            :disabled="user.role == 'owner'",
            label="Adminx"
          )
  h3 Pending invitations
    .rows
      .row(v-for="user in list.invitees", :key="user._id")
        .w-flex
          | {{ user.email }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Form from "@/mixins/Form";

export default {
  name: "ManageList",
  mixins: [Form],
  data() {
    return {
      processing: false,
      description: "bla fah sel",
      roles: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Owner", value: "owner" },
      ],
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
    ...mapActions(["updateList", "toggleAdmin"]),
    close() {
      bus.$emit("manageList", false);
    },
    async toggleAdminNow(userId, isAdmin) {
      console.log(this.listId, userId, isAdmin);
      if (this.processing) {
        return;
      }
      this.processing = true;
      console.log("go");
      this.toggleAdmin({
        listId: this.listId,
        userId,
        isAdmin,
      })
        .then(() => {
          this.processing = false;
        })
        .catch((err) => this.showError(err));
    },
    async add() {
      this.updateList({
        list,
      }).catch((err) => this.showError(err));
    },
  },
};
</script>

<style>
.admin-toggle {
  font-size: 0.7em;
  text-transform: uppercase;
}
</style>
