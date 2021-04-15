<template>
  <base-layout page-title="Add List" link="/app/list">
    <template v-slot:content>
      <create-list-form></create-list-form>
    </template>
  </base-layout>
</template>

<script>
import CreateListForm from "@/components/list/CreateListForm.vue";

export default {
  components: {
    CreateListForm,
  },
};
</script>
