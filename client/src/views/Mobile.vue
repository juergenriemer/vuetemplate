<template>
  <IonPage>
    <component :is="page"></component>
  </IonPage>
</template>

<script>
import ListsPage from "../pages/ListsPage.vue";
import ItemsPage from "../pages/ItemsPage.vue";
import ListInfoPage from "../pages/ListInfoPage.vue";
import ListMembersPage from "../pages/ListMembersPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import AddListPage from "../pages/AddListPage.vue";
import EditListPage from "../pages/EditListPage.vue";
const pages = {
  info: ListInfoPage,
  members: ListMembersPage,
  add: AddListPage,
  edit: EditListPage,
};

export default {
  components: {
    ListsPage,
    ItemsPage,
    AddListPage,
    EditListPage,
    ListInfoPage,
    ListMembersPage,
  },
  data() {
    return {
      infoComponent: null,
    };
  },
  computed: {
    listId() {
      return this.$route.params.listId;
    },
    page() {
      return pages[this.$route.params.page];
    },
  },
  methods: {},
  updated() {},
};
</script>
<style>
</style>
