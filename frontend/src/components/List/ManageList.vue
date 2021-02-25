<template lang="pug">
#manage-list.row(v-if="showManageList")
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
      .rows2
        .row2(v-for="user in list.users", :key="user._id")
          .avatar {{ user.short }}
          div {{ user.name }} {{ user.role }}
          w-select(:items="roles", v-model="user.role")
    h3 Pending invitations
      .rows
        .row(v-for="user in list.invitees", :key="user._id")
          .w-flex
            | {{ user.email }}
    w-button(lg, @click="close") CLOSE
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
      description: "bla fah sel",
      showManageList: false,
      roles: [
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Owner", value: "owner" },
      ],
    };
  },
  created() {
    bus.$on("manageList", (isShown) => {
      this.showManageList = isShown;
    });
  },
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
    ...mapActions(["updateList"]),
    close() {
      bus.$emit("manageList", false);
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
#manage-list {
  overflow: auto;
  height: calc(100vh - 132px); /* +2 for two times borders */
  background: repeating-linear-gradient(
    45deg,
    #ececec,
    #ececec 5px,
    #efefef 5px,
    #efefef 10px
  );
}
@media (min-width: 1300px) {
  #manage-list {
    height: calc(100vh - 172px);
  }
}
</style>
