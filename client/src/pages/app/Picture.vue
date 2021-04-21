<template>
  <base-layout :page-title="currentItem.title" :link="link()">
    <template v-slot:title>
      <avatar size="large" :list-title="currentList.title" />
    </template>
    <template v-slot:actions-end>
      <div class="header-icon">
        <ion-icon :icon="image" size="large"></ion-icon>
      </div>
    </template>
    <template v-slot:content>
      <img ref="image" />
    </template>
  </base-layout>
</template>

<script>
import appConfig from "@/config.js";
import { IonIcon } from "@ionic/vue";
import Avatar from "@/components/base/Avatar.vue";
import { image } from "ionicons/icons";

export default {
  components: {
    Avatar,
    IonIcon,
  },
  data() {
    return { image };
  },
  mounted() {
    this.loadImage();
  },
  watch: {
    "$route.params.imageFile": function () {
      this.loadImage();
    },
  },
  methods: {
    link() {
      return `/app/comments/${this.currentList._id}/${this.currentItem._id}`;
    },
    loadImage() {
      var host = appConfig.backend;
      var root = "file";
      var imageFile = this.$route.params.imageFile;
      if (!imageFile) return;
      var url = `${host}/${root}/${this.currentList._id}/${this.currentItem._id}/large_${imageFile}`;
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
          this.$refs.image.setAttribute("src", outside);
        });
    },
  },
};
</script>
