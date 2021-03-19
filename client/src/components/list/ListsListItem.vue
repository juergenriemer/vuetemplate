<template>
  <ion-item :router-link="`/lists/${list._id}`">
    <div class="jdicon" v-html="jicon(list.title)"></div>
    <div class="title">
      {{ list.title }}
    </div>
    <ion-icon slot="end" :icon="menu" size="small"></ion-icon>
  </ion-item>
</template>

<script>
import { IonItem, IonThumbnail, IonImg, IonLabel } from "@ionic/vue";
import { ellipsisVertical } from "ionicons/icons";
import { toSvg } from "jdenticon";

export default {
  props: ["list"],
  data() {
    return {
      menu: ellipsisVertical,
    };
  },
  components: {
    IonItem,
    IonThumbnail,
    IonImg,
    IonLabel,
  },
  methods: {
    jicon(text) {
      return toSvg(text, 40);
    },
  },
};
</script>
<style>
.jdicon {
  padding: 4px;
}
.title {
  font-size: 1.3em;
}
</style>
