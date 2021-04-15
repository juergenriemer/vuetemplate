<template lang="pug">
.bubble(:id="item._id", :class="pos(item)")
  .bubble-content
    .top
      .name(:style="{ color: userColor(item.creatorId) }")
        | {{ userName(item.creatorId) }}
      ion-icon.menu(
        slot="icon-only",
        :icon="ellipsisVertical",
        @click="showMenu"
      )
    img.ion-hide.thumb(ref="thumb")
    .text {{ item.text }}
    .date {{ ago(item.updatedAt) }}
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
import ItemMenu from "@/components/comment/CommentMenu.vue";
import { alertController, popoverController } from "@ionic/core";
import Dates from "@/mixins/Dates";
import User from "@/mixins/User";

export default {
  props: ["item", "itemId"],
  mixins: [Dates, User],
  data() {
    return {
      menu: null,
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
    ItemMenu,
    IonAvatar,
    IonIcon,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonPopover,
  },
  mounted() {
    if (this.item.imageFile) {
      var imageFile = this.item.imageFile;
      var host = "http://10.0.0.136:3003";
      var root = "file";
      var listId = this.listId();
      var itemId = this.itemId;
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
        });
    }
  },
  methods: {
    pos(item) {
      if (item.text == "test") return "left";
      return this.myId !== item.creatorId ? "right" : "left";
    },
    async showMenu(evt) {
      popoverController
        .create({
          component: ItemMenu,
          componentProps: {
            item: this.item,
            action: (evt) => this.menuAction(evt),
          },
          cssClass: "my-custom-class",
          event: evt,
          translucent: true,
        })
        .then((res) => {
          this.menu = res;
          this.menu.present();
        });
    },
    menuAction(evt) {
      this.menu.dismiss();
      const action = evt.target.getAttribute("data");
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
                    listId: this.listId(),
                    itemId: this.itemId,
                    commentId: this.item._id,
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

.bubble .image {
  max-height: 600px;
  border: 1px solid #444;
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
