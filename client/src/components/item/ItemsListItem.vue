<template>
  <div>
    <ion-item
      style="--padding-bottom: 6px; --padding-top: 6px"
      lines="full"
      :class="item.updatedAt>lastSeen ? 'new': ''"
      detail="false"
      button="true"
    >
      <ion-label @dblclick="checkItem(item)" class="title">
        {{ item.title }}
      </ion-label>
      <ion-buttons slot="start">
        <ion-button
          aria-label="item-status"
          :class="item.done ? 'done2' : 'undone2'"
          @click="checkItem(item._id)"
        >
          <ion-icon slot="icon-only" :icon="checkmark"></ion-icon>
        </ion-button>
      </ion-buttons>

      <ion-reorder v-if="reorderMode" slot="end"></ion-reorder>
      <ion-buttons v-if="!reorderMode" slot="end">
        <ion-button aria-label="comments" @click="loadComments(item._id)" v-if="item.comments.length">
          <div class="chat-wrapper">
            <ion-icon slot="icon-only" :icon="chatboxEllipses"></ion-icon>
            <ion-badge v-if="newComments" color="danger">{{newComments}}</ion-badge>
          </div>
        </ion-button>
        <ion-button 
            aria-label="item-menu"
          @click="showMenu($event)">
          <ion-icon 
            slot="icon-only" :icon="ellipsisVertical"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
  </div>
</template>

<script>
import {
  IonAvatar,
  IonReorder,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonPopover,
  IonToolbar,
  IonBadge,
} from "@ionic/vue";
import {
  chevronForward,
  ellipsisVertical,
  settings,
  heart,
  chatboxEllipses,
  checkmark,
  thumbsUp,
  trash,
  create,
} from "ionicons/icons";
import MenuComponent from "@/components/item/ItemMenu.vue";
import Menu from "@/mixins/Menu";
import Alert from "@/mixins/Alert";
export default {
  props: ["lastSeen", "listId", "item", "reorderMode", "itemInCommentMode"],
  emits: ["change-mode"],
  mixins: [Menu, Alert],
  data() {
    return {
      ellipsisVertical,
      chatboxEllipses,
      checkmark,
      chevronForward,
      thumbsUp,
      heart,
      trash,
      settings,
    };
  },
  components: {
    //   CommentsList,
    MenuComponent,
    IonReorder,
    IonToolbar,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonPopover,
    IonBadge,
  },
  computed: {
    newComments() {
      let count = this.item.comments.filter( cmt => cmt.updatedAt > this.lastSeen).length;
      console.log( count); 
    return count;
    }
  },
  methods: {
    menuAction(action) {
      switch (action) {
        case "delete-item":
          this.confirm("to delete this item", () => {
            this.$store
              .dispatch("deleteItem", {
                listId: this.listId,
                itemId: this.item._id,
              })
              .catch((err) => this.showError(err));
          });
          break;
        case "edit-mode":
          let data = { mode: "edit", item: this.item };
          this.$emit("change-mode", data);
          break;
        case "comments":
          this.loadComments(this.item._id);
          break;
      }
    },
    loadComments(itemId) {
      const route = `/app/comments/${this.listId}/${itemId}/${this.lastSeen}`;
      this.nav(route);
    },
    checkItem() {
      this.item.done = !this.item.done;
      this.$store
        .dispatch("updateItem", {
          listId: this.listId,
          itemId: this.item._id,
          item: this.item,
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
<style>
.comment-mode {
  --background: primary;
  background: #c0c0c0;
}
.jdicon {
  padding: 4px;
}
.title {
  margin-left: 0px;
  padding: 0px;
  font-size: 1.4em !important;
}
ion-item.new {
    --ion-item-background:lightyellow !important;
}
.undone2 {
  color: #444;
  --background: whitesmoke !important;
  --ionicon-stroke-width: 90px;
}
.done2 {
  color: #fff;
  --background: green !important;
  --ionicon-stroke-width: 90px;
}
.chat-wrapper {
  position:relative;
}
.chat-wrapper ion-badge {
  --padding-bottom:3px;
  --padding-top:3px;
  --padding-left:1px;
  --padding-right:1px;
  font-size:10px;
  z-index:99;
  position:absolute;
  top:0;
  right:0;
  margin-top:-4px;
  margin-right:-5px;
}
</style>
