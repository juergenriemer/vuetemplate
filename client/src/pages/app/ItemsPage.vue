<template>
  <base-layout :page-title="list2.title" page-id="ItemsPage" :link="link">
    <template v-slot:title>
      <avatar size="large" :list-title="list2.title"></avatar>
    </template>
    <template v-slot:actions-end>
      <ion-button color="dark" @click="showMenu($event, menuData)">
        <ion-icon
          slot="icon-only"
          :icon="ellipsisVertical"
        ></ion-icon>
      </ion-button>
    </template>
    <template v-slot:content>
      <items-list
        class="grid"
        v-if="list2"
        :listId="list2._id"
        :items="list2.items"
        :lastSeen="lastSeen"
        :reorderMode="reorderMode"
        :itemInEditMode="itemInEditMode"
        :itemShowMode="itemShowMode"
        @change-mode="changeMode"
      ></items-list>
      <div v-if="!list2">loading</div>
    </template>
    <template v-slot:footer>
        <create-item-form
          @duplicate="showDuplicateInfo"
          @toggleItemShowMode="itemShowMode = !itemShowMode"
          :hiddenItems="hiddenItems"
        :itemShowMode="itemShowMode"
        :list="list2"
        v-if="!itemInEditMode"
      ></create-item-form>
      <edit-item-form
        v-if="itemInEditMode"
          @duplicate="showDuplicateInfo"
          @toggleItemShowMode="itemShowMode = !itemShowMode"
          :hiddenItems="hiddenItems"
        :itemShowMode="itemShowMode"
        :list="list2"
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
import { alertController } from "@ionic/core";
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
      duplicateInfo : false,
      edit: {},
      actionItem: {},
      lastSeen:null,
      reorderMode: false,
      ellipsisVertical,
      itemInEditMode: null,
      itemInCommentMode: null,
      itemShowMode: null,
    };
  },
  mounted() {
    this.saw();
    this.setShowItemMode();
    window.bus.on("list-settings-change", () => {
      this.setShowItemMode();
    });
  },
  watch : {
    '$route': function( to, from ) {
      if( /^.app.items/.test( to.path)){
        this.saw();
      }
    }
  },
  computed: {
    hiddenItems(){
      if( this.list2.hideDoneItems ) {
        return this.list2.items.filter( itm => itm.done ).length;
      }
      return false;
    },
    toggleMode() {
      return this.list2.items.filter( itm => itm.done ).length !== this.list2.items.length;
    },
    link() {
      return self.$$.isWeb ? "" : "/app/list";
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
        return this.$store.getters.item(listId, itemId);
      }
      return {};
    },
    menuData() {
      return { reorderMode: this.reorderMode, toggleMode: this.toggleMode, itemShowMode : this.itemShowMode };
    },
  },
  methods: {
    setShowItemMode() {
      this.itemShowMode = ! this.list2.hideDoneItems;
    },
    saw() {
      try {
        const listId = this.$route.params.id;
        const userId = this.$store.getters.userId;
        this.$store
          .dispatch("sawItems", { listId, userId })
          .catch((err) => this.showError(err));
      }
      catch( e ) { /* swallow */ }
    },
    menuAction(action) {
      switch (action) {
        case "reorderMode":
          this.reorderMode = !this.reorderMode;
          break;
        case "itemShowMode":
          this.itemShowMode = !this.itemShowMode;
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
    async showDuplicateInfo() {
      alertController
        .create({
          header: "Item alreay exists",
          message: `<p>Your list is set to prevent duplicates.</p>
          <p>If you want to allow duplicates please edit this list.</p>
          `,
          buttons: [
            {
              text: "EDIT LIST",
              handler: () => {
                this.nav( `/app/edit/${this.list2._id}`)
              },
            },
            {
              text: "CANCEL",
              handler: () => {},
            },
          ],
        })
        .then((res) => {
          this.duplicateInfo = res;
          this.duplicateInfo.present();
        });
    },
  },
};
</script>
