<template lang="pug">
.bubble(:id="comment._id", :class="pos(comment)")
  .bubble-content
    .top
      .name(:style="{ color: userColor(comment.creatorId) }")
        | {{ userName(comment.creatorId) }}
      ion-icon.menu(
        slot="icon-only",
        :icon="ellipsisVertical",
        @click="showMenu"
      )
    img.ion-hide.thumb(ref="thumb", @click="openPicture(comment.imageFile)")
    .text {{ comment.text }}
    .date {{ ago(comment.updatedAt) }}
</template>


<script>
import {
  IonAvatar,
  IonReorder,
  IonImg,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonPopover,
  IonToolbar,
} from "@ionic/vue";
import {
  chevronForward,
  ellipsisVertical,
  settings,
  checkmark,
  close,
  trash,
  create,
} from "ionicons/icons";
import MenuComponent from "@/components/comment/CommentMenu.vue";
import { alertController } from "@ionic/core";
import Dates from "@/mixins/Dates";
import User from "@/mixins/User";
import Menu from "@/mixins/Menu";

export default {
  props: ["listId", "item", "comment"],
  mixins: [Dates, User, Menu],
  data() {
    return {
      close,
      ellipsisVertical,
      checkmark,
      chevronForward,
      trash,
      settings,
    };
  },
  components: {
    IonReorder,
    IonToolbar,
    MenuComponent,
    IonAvatar,
    IonImg,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonPopover,
  },
  mounted() {
    if (this.comment.imageFile) {
      var imageFile = this.comment.imageFile;
      var host = "http://10.0.0.136:3003";
      var root = "file";
      var listId = this.listId;
      var itemId = this.item._id;
      var url = `${host}/${root}/${listId}/${itemId}/thumb_${imageFile}`;
      var opts = {
        credentials: "include",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      fetch(url, opts)
        .then((res) => res.blob())
        .then((image) => {
          var outside = URL.createObjectURL(image);
          this.$refs.thumb.setAttribute("src", outside);
          this.$refs.thumb.classList.remove("ion-hide");
        })
        .catch((err) => {
          this.showError(err);
        });
    }
  },
  methods: {
    pos(comment) {
      return this.myId !== comment.creatorId ? "right" : "left";
    },
    openPicture(imageFile) {
      var listId = this.listId;
      var itemId = this.item._id;
      var path = `/app/picture/${listId}/${itemId}/${imageFile}`;
      this.nav(path);
    },
    menuAction(action) {
      switch (action) {
        case "delete-item":
          this.deleteItem();
          break;
      }
    },
    async deleteItem() {
      alertController
        .create({
          header: "Delete item?",
          message: "Are you sure you want to delete this item?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
            },
            {
              text: "OK",
              handler: () => {
                this.$store
                  .dispatch("deleteComment", {
                    listId: this.listId,
                    itemId: this.item._id,
                    commentId: this.comment._id,
                  })
                  .then((res) => res)
                  .catch((err) => this.showError(err));
              },
            },
          ],
        })
        .then((res) => res.present());
    },
  },
};
</script>
<style>
.comments {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.bubble {
  position: relative;
  max-width: 70%;
  min-width: 30%;
  margin: 10px;
  padding: 2px;
  border-radius: 5px;
  border: solid whitesmoke;
  background: whitesmoke;
}
.bubble:before {
  content: "";
  position: absolute;
  top: 0px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 13px 5px 0;
  border-color: transparent whitesmoke transparent transparent;
  right: 100%;
}
.bubble.right {
  align-self: flex-end;
}

.bubble.right:before {
  left: 100%;
  border-width: 5px 0 5px 13px;
  border-color: transparent transparent transparent whitesmoke;
}

.bubble {
  align-items: stretch !important;
}
.bubble .bubble-content {
  display: flex;
  justify-content: stretch !important;
  background: whitesmoke;
  flex-direction: column;
}

.bubble .thumb {
  max-height: 300px;
  max-width: 300px;
  cursor: pointer;
}

.bubble .bubble-content .top {
  justify-content: stretch !important;
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
}
.bubble .bubble-content .top .name {
  font-weight: bold;
  font-size: 0.8em;
  flex-wrap: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 10;
}
.bubble .text {
  white-space: pre;
}
.bubble .bubble-content .top .menu {
  font-size: 14px;
  cursor: pointer;
}
.bubble .bubble-content .date {
  font-size: 0.8em;
  align-self: flex-end;
  color: #aaa;
}

.comment-background {
  background: #ffe3cd !important;
}
</style>
