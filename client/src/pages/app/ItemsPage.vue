<template>
  <base-layout :page-title="list2.title" page-id="ItemsPage" :link="link">
    <template v-slot:title>
      <avatar size="large" :list-title="list2.title"></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button @click="showMenu($event, menuData)">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
          size="medium"
        ></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <items-list
        v-if="list2"
        :listId="list2._id"
        :items="list2.items"
        :lastSeen="lastSeen"
        :reorderMode="reorderMode"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></items-list>
      <div v-if="!list2">loading</div>
    </template>
    <template v-slot:footer>
      <create-item-form
        :listId="list2._id"
        v-if="!itemInEditMode"
      ></create-item-form>
      <edit-item-form
        v-if="itemInEditMode"
        :listId="list2._id"
        :itemInEditMode="itemInEditMode"
        @change-mode="changeMode"
      ></edit-item-form>
    </template>
  </base-layout>
</template>

<script>
import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";

import ItemsList from "@/components/item/ItemsList.vue";
import CreateItemForm from "@/components/item/CreateItemForm.vue";
import EditItemForm from "@/components/item/EditItemForm.vue";
import Avatar from "@/components/base/Avatar.vue";
import MenuComponent from "@/components/item/AllItemsMenu.vue";

import Menu from "@/mixins/Menu";
export default {
  name: "ItemsPage",
  mixins: [Menu],
  components: {
    Avatar,
    ItemsList,
    CreateItemForm,
    EditItemForm,
    MenuComponent,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      edit: {},
      actionItem: {},
      lastSeen:null,
      reorderMode: false,
      ellipsisVertical,
      itemInEditMode: null,
      itemInCommentMode: null,
    };
  },
  mounted() {
    this.seeList();
  },
  watch : {
    '$route': function( to, from ) {
      if( /^.app.items/.test( to.path)){
        this.seeList();
      }
    }
  },
  computed: {
    toggleMode() {
      return this.list2.items.filter( itm => itm.done ).length !== this.list2.items.length;
    },
    link() {
      return self.isWeb ? "" : "/app/list";
    },
    // REF: move to baselayout.. same in ResetPassword.vue
    list2() {
      const listId = this.$route.params.id;
      if (listId) {
        return this.$store.getters.list(listId);
      }
      return {};
    },
    currentItem() {
      const listId = this.$route.params.id;
      const itemId = this.$route.params.itemId;
      if (listId && itemId) {
        console.log(this.$store.getters.item(listId, itemId));
        return this.$store.getters.item(listId, itemId);
      }
      return {};
    },
    menuData() {
      return { reorderMode: this.reorderMode, toggleMode: this.toggleMode };
    },
  },
  methods: {
    seeList() {
      const params= this.$route.params;
      if( params && params.id ){
        const userId = this.$store.getters.userId;
        this.lastSeen = this.list2.users.find( usr => usr.userId == userId ).lastSeen;
        return this.$store
          .dispatch("sawList", { listId: params.id, userId })
          .then(() => {
            //this.nav(`/app/items/${this.list._id}`);
          })
          .catch((err) => this.showError(err));
      }
    },
    menuAction(action) {
      switch (action) {
        case "reorderMode":
          this.reorderMode = !this.reorderMode;
          break;
        case "toggleMode":
          //this.toggleMode = !this.toggleMode;
          this.$store
            .dispatch("toggleList", {
              listId: this.list2._id,
              done: this.toggleMode,
            })
            .catch((err) => this.showError(err));

          break;
      }
    },
    changeMode({ mode, item }) {
      this.itemInEditMode = null;
      this.itemInCommentMode = null;
      switch (mode) {
        case "edit":
          this.itemInEditMode = item;
          break;
        case "comment":
          this.itemInCommentMode = item;
          break;
      }
    },
  },
};
</script>
