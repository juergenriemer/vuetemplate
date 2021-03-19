<template>
  <base-layout page-title="Add List" page-default-back-link="/lists">
    <create-list-form @save-list="saveList"></create-list-form>
  </base-layout>
</template>

<script>
import CreateListForm from "../components/list/CreateListForm.vue";

import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    CreateListForm,
  },
  data() {},
  methods: {
    ...mapActions(["addList"]),
    async saveList(list) {
      this.addList({ list }).then(() => {
        this.$router.replace("/lists");
      });
    },
  },
};
</script>
