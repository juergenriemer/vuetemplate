<template>
  <base-layout page-title="Edit List" link="/app/list">
    <template v-slot:content>
      <edit-list-form :form="list" @update-list="updateList"></edit-list-form>
    </template>
  </base-layout>
</template>

<script>
import EditListForm from "@/components/list/EditListForm.vue";

export default {
  components: {
    EditListForm,
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.id);
    },
  },
  methods: {
    async updateList(list) {
      this.$store
        .dispatch("updateList", { listId: list._id, list })
        .then(() => {
          this.nav(`/app/items/${list._id}`);
        });
    },
  },
};
</script>
