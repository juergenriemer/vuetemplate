<template lang="pug">
.form
  h4 {{ list.title }}
  p(v-if="list.description") {{ list.description }}
  p(v-else)
    em No description available
  p Created by {{ owner }} on {{ date(list.createdAt) }}
  h4 Current Members
  .row(v-for="user in list.users", :key="user._id")
    .avatar(:style="{ background: avatarColor(user.short) }") {{ user.short }}
      i.fas.fa-crown.admin.owner(v-if="user.role == 'owner'")
      i.fas.fa-crown.admin(v-if="user.role == 'admin'")
    .title {{ user.name }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { bus } from "../../main";
import Form from "@/mixins/Form";

export default {
  name: "ListInfo",
  mixins: [Form],
  data() {
    return {
      listId: null,
      description: "bla fah sel",
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
    /*
    close() {
      bus.$emit("manageList", false);
      bus.$emit("manageMembers", false);
    },
     */
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
