<template>
  <base-layout page-title="All Lists">
    <template v-slot:actions-end>
      <ion-button router-link="/lists/add">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </template>

    <lists-list v-if="lists" :lists="lists"></lists-list>
    <div v-if="!lists">loading</div>
  </base-layout>
</template>

<script>
import { IonButton, IonIcon } from "@ionic/vue";
import { add } from "ionicons/icons";
import { mapGetters, mapActions } from "vuex";

import ListsList from "../components/list/ListsList.vue";

export default {
  components: {
    ListsList,
    IonButton,
    IonIcon,
  },
  data() {
    return { add };
  },
  mounted() {
    setTimeout(() => {
      console.log(this.fetchLists);
      this.fetchLists();
    }, 2000);
  },
  computed: {
    ...mapGetters(["lists"]),
  },
  methods: {
    ...mapActions(["sawList", "fetchLists", "deleteList", "updateList"]),
    async fetch() {
      if (!self.isLocal)
        this.fetchLists()
          .then(() => {
            if (this.listId) {
              return this.sawList({ listId: this.listId, userId: this.userId });
            }
          })
          .catch((err) => {
            this.showError(err);
          });
    },
  },
};
</script>
