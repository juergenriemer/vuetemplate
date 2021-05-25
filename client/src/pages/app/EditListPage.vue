<template>
  <base-layout :page-title="list.title" page-id="EditListPage" link="/app/list">
    <template v-slot:title>
      <avatar size="large" :list-title="list.title" />
    </template>
    <template v-slot:actions-end>
      <div class="header-icon">
        <ion-icon :icon="create" size="large"></ion-icon>
      </div>
    </template>
    <template v-slot:content>
      <edit-list-form :list="list"></edit-list-form>
    </template>
  </base-layout>
</template>

<script>
import EditListForm from "@/components/list/EditListForm.vue";
import { IonIcon } from "@ionic/vue";
import { create } from "ionicons/icons";
import Avatar from "@/components/base/Avatar.vue";
export default {
  components: {
    Avatar,
    IonIcon,
    EditListForm,
  },
  computed: {
    list() {
      return this.$store.getters.listById(this.$route.params.id);
    },
  },
  data() {
    return { create };
  },
};
</script>
