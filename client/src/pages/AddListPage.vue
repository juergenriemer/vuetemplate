<template>
  <base-layout page-title="Add List" page-default-back-link="/lists">
    <template v-slot:content>
      <create-list-form @save-list="saveList"></create-list-form>
    </template>
  </base-layout>
</template>

<script>
import CreateListForm from "../components/list/CreateListForm.vue";

export default {
  components: {
    CreateListForm,
  },
  methods: {
    async saveList(list) {
      this.$store.dispatch("addList", { list }).then(() => {
        this.$router.replace("/lists");
      });
    },
  },
};
</script>
