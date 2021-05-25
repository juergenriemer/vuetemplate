<template>
  <base-layout page-title="Add List" page-id="AddListPage" link="/app/list">
    <template v-slot:title>
      <avatar size="large" logo="Listle" />
    </template>
    <template v-slot:content>
      <create-list-form></create-list-form>
    </template>
  </base-layout>
</template>

<script>
import CreateListForm from "@/components/list/CreateListForm.vue";
import Avatar from "@/components/base/Avatar.vue";

export default {
  components: {
    Avatar,
    CreateListForm,
  },
};
</script>
