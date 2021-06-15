<template>
  <IonPage>
    <component :is="page"></component>
  </IonPage>
</template>

<script>
import ListsPage from "../pages/app/ListsPage.vue";
import ItemsPage from "../pages/app/ItemsPage.vue";
import ListInfoPage from "../pages/app/ListInfoPage.vue";
import ListMembersPage from "../pages/app/ListMembersPage.vue";
import LoginPage from "../pages/user/Login.vue";
import AddListPage from "../pages/app/AddListPage.vue";
import EditListPage from "../pages/app/EditListPage.vue";
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
