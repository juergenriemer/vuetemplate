<template lang="pug">
#info-menu
  .buttons
    i.fas.fa-times(v-on:click="close()")
  h3.title {{ title }}
</template>
<script>
import { bus } from "../../main";
export default {
  name: "InfoHeader",
  props: ["title"],
  methods: {
    close() {
      bus.$emit("closeInfo");
    },
  },
};
</script>
