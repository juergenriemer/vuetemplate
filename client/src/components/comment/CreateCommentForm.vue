<template>
  <form id="bottom-input" class="ion-padding" @submit.prevent="submit">
    <ion-fab vertical="bottomxl" horizontal="startx" xslot="fixed">
      <ion-fab-button aria-label="attachment" id="comment-fab" color="primary" size="small">
        <ion-icon :icon="attach"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button aria-label="upload" @click="$refs.upload.click()">
          <ion-icon :icon="image" size="medium"></ion-icon>
          <input
            ref="upload"
            accept="image/*"
            class="ion-hide"
            type="file"
            id="file"
            @change="previewPicture()"
          />
        </ion-fab-button>
        <ion-fab-button @click="takePicture">
          <ion-icon :icon="camera" size="medium"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
    <ion-toolbar class="comment-toolbar">
      <div id="input">
        <div class="wrapper">
          <div class="image" v-show="imageFile">
            <img ref="thumb" class="thumb" />
            <ion-icon
              class="remove"
              @click="imageFile = null"
              icon="close-circle"
              size="small"
            ></ion-icon>
          </div>
          <div
            ref="input"
            contenteditable="true"
            data-placeholder="NEW COMMENT"
            @input="setText"
          ></div>
        </div>
      </div>
      <ion-buttons id="comment-buttons" slot="end">
        <ion-button aria-label="close-comment" @click="reset">
          <ion-icon :icon="close" size="medium"></ion-icon>
        </ion-button>
        <ion-button aria-label="save-comment" :disabled="saveDisabled" @click="submit">
          <ion-icon :icon="send" size="medium"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </form>
</template>

<script>
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import BottomInput from "@/components/base/Input.vue";
import Data from "@/mixins/Data";
import User from "@/mixins/User";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
const { Camera } = Plugins;
import { attach, image, camera, send, close } from "ionicons/icons";
export default {
  props: ["listId", "item"],
  emits: ["change-mode"],
  mixins: [Data, User],
  components: {
    BottomInput,
    IonFab,
    IonFabButton,
    IonFabList,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  },
  data() {
    return {
      camera,
      attach,
      image,
      send,
      close,
      imageFile: null,
      text: "",
    };
  },
  computed: {
    saveDisabled() {
      return !this.text && !this.imageFile;
    },
  },
  methods: {
    setText(evt) {
      this.text = evt.target.innerText;
    },
    reset() {
      this.$refs.input.textContent = "";
      this.text = "";
      this.imageFile = null;
    },
    async takePicture() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 60,
      });
      this.previewPicture(photo.webPath);
    },
    previewPicture(image) {
      document.querySelector("#comment-fab").click();
      this.imageFile = image || this.$refs.upload.files[0];
      const url = window.URL.createObjectURL(this.imageFile);
      this.$refs.thumb.src = url;
      //this.setFocus(); no focus because I only want to see them normally? true for items as well?
    },
    submit() {
      let text = this.text;
      let item = {
        _id: this.objectId(),
        creatorId: this.myId(),
        text,
      };
      Promise.resolve()
        .then((res) => {
          if (this.imageFile) {
            let formData = new FormData();
            formData.append("file", this.imageFile);
            return this.$store.dispatch("upload", {
              listId: this.listId,
              itemId: this.item._id,
              formData,
            });
          } else return true;
        })
        .then((res) => {
          if (res && res.data && res.data.imageFile) {
            item.imageFile = res.data.imageFile;
          }
          return this.$store.dispatch("addComment", {
            listId: this.listId,
            itemId: this.item._id,
            comment: item,
          });
        })
        .then((res) => {
          this.reset();
          this.scrollToBottom();
        })
        .catch((err) => {
          this.showError(err);
        });
    },
  },
};
</script>
<style>
#input {
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  max-height: 180px;
}

ion-toolbar.comment-toolbar {
  padding-left: 55px;
}

#input .remove {
  cursor: pointer;
}

#input .wrapper {
  overflow: auto;
  max-height: 160px;
}

#input [contenteditable="true"] {
  background: #fff;
  color: #444;
}
#input [contenteditable="true"]:empty {
  color: #c0c0c0;
}

[contenteditable="true"]:empty:before {
  content: attr(data-placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}

#input [contenteditable="true"]:focus {
  outline: none;
}

#input .image {
  display: flex;
  position: relative;
}
#input .remove {
  cursor: pointer;
  position: absolute;
  top: 0px;
  left: 0px;
  color: white;
}
#input .remove:hover {
  color: #c0c0c0;
}
#input .thumb {
  border-top-left-radius: 10px;
}
.thumb {
  border-radius: 5px;
}
</style>
