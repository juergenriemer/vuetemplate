<template>
  <base-layout :page-title="currentItem.title" page-id="CommentsPage" :link="link">
    <template v-slot:title>
      <avatar size="large" :list-title="currentList.title" />
    </template>
    <template v-slot:actions-end>
      <div class="header-icon">
        <ion-icon :icon="chatboxEllipses" size="large"></ion-icon>
      </div>
    </template>
    <template v-slot:content>
      <comments-list
        v-if="currentItem"
        :listId="currentList._id"
        :item="currentItem"
        :comments="currentItem.comments"
        :itemInEditMode="itemInEditMode"
      ></comments-list>
    </template>
    <template v-slot:footer>
      <create-comment-form
        :listId="currentList._id"
        :item="currentItem"
        @change-mode="changeMode"
      ></create-comment-form>
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
import { popoverController } from "@ionic/core";
import { ellipsisVertical, chatboxEllipses } from "ionicons/icons";
import CommentsList from "@/components/comment/CommentsList.vue";
import CreateCommentForm from "@/components/comment/CreateCommentForm.vue";
import Avatar from "@/components/base/Avatar.vue";

export default {
  components: {
    Avatar,
    CommentsList,
    CreateCommentForm,
    IonContent,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      ellipsisVertical,
      chatboxEllipses,
      itemInEditMode: null,
      itemInCommentMode: null,
    };
  },
  mounted() {
        this.saw();
  },
  watch : {
    '$route': function( to, from ) {
      if( /^.app.comments/.test( to.path)){
           this.saw();
      }
    }
  },
  computed: {
    // REF: move to baselayout.. same in ResetPassword.vue
    link() {
      const lnk = self.$$.isWeb ? "/app/list" : `/app/items/${this.currentList._id}`;
      return lnk;
    },
  },
  methods: {
    saw() {
      setTimeout( ()=>{
      console.log( ">> saw comments")
      try {
        const listId = this.$route.params.id;
        const itemId = this.$route.params.itemId;
        const userId = this.$store.getters.userId;
        this.$store
          .dispatch("sawComments", { listId, itemId, userId })
          .catch((err) => this.showError(err));
      }
      catch( e ) { console.log("???") /* swallow */ }
      }, 1000)
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
