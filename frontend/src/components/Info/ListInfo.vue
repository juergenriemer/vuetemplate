<template lang="pug">
.form
  h3 {{ list.title }}
  p(v-if="list.description") {{ list.description }}
  p(v-else)
    em No description available
  p Created by {{ owner }} on {{ list.createdAt }}
  h3 Current Members
    .row(v-for="user in list.users", :key="user._id")
      .avatar(:style="{ background: avatarColor(user.short) }") {{ user.short }}
        i.fas.fa-crown.admin.owner(v-if="user.role == 'owner'")
        i.fas.fa-crown.admin(v-if="user.role == 'admin'")
      div {{ user.name }} {{ user.role }}
  h3(v-if="listAdmin") Pending invitations
    .rows
      .row(v-for="user in list.invitees", :key="user._id")
        .title {{ user.email }}
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
      listId: null,
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
    owner() {
      return this.list.users.find((usr) => usr.role == "owner").name;
    },
  },
  methods: {
    ...mapActions(["updateList"]),
    setListId() {
      this.listId = this.$route.params.id;
    },
    close() {
      bus.$emit("manageList", false);
    },
    async add() {
      this.updateList({
        list,
      }).catch((err) => this.showError(err));
    },
  },
  created() {
    this.setListId();
  },
  watch: {
    $route(to, from) {
      this.setListId();
    },
  },
};
</script>
